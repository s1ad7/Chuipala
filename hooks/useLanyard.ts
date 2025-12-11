import { useState, useEffect, useRef, useCallback } from 'react';

const DISCORD_ID = '1019243841498394654';

export interface LanyardData {
  spotify: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  } | null;
  discord_user: {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string | null;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    } | null;
    global_name?: string | null;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify: boolean;
}

export interface Activity {
  type: number;
  state: string;
  name: string;
  id: string;
  details?: string;
  timestamps?: {
    start: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

export interface DiscordProfile {
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    avatar_decoration_data: { asset: string; sku_id: string } | null;
    banner: string | null;
    banner_color: string | null;
    accent_color: string | null;
    bio: string;
  };
  badges: {
    id: string;
    description: string;
    icon: string;
    link?: string;
  }[];
}

export const useLanyard = () => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  
  // Refs to manage connection state
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch static profile data (Bio, Banner, Badges)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Using dcdn.dstn.to as a proxy to get public profile data
        const response = await fetch(`https://dcdn.dstn.to/profile/${DISCORD_ID}`);
        const json = await response.json();
        if (json) {
          setProfile(json);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    fetchProfile();
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    // Clear any pending reconnect attempts
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    console.log("Connecting to Lanyard WebSocket...");
    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Lanyard WebSocket Connected");
      // Subscribe to ID
      socket.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: DISCORD_ID }
      }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // Handle Init State and Updates
      if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
        setData(message.d);
      }

      // Handle Heartbeat Hello
      if (message.op === 1) {
        const interval = message.d.heartbeat_interval;
        
        // Clear previous heartbeat if exists
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        
        // Send initial heartbeat immediately (optional but good practice)
        // socket.send(JSON.stringify({ op: 3 })); 

        heartbeatIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
             socket.send(JSON.stringify({ op: 3 }));
          }
        }, interval);
      }
    };

    socket.onclose = (event) => {
      console.log("Lanyard WebSocket Closed:", event.code, event.reason);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      
      // Automatic Reconnect
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000); // Retry after 3 seconds
    };

    socket.onerror = (error) => {
      console.error("Lanyard WebSocket Error:", error);
      socket.close();
    };

  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return { lanyard: data, profile };
};