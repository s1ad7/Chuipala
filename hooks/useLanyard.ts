import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // 1. Fetch Basic Lanyard Data
    const fetchLanyard = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await response.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Lanyard fetch failed:", error);
      }
    };

    // 2. Fetch Extended Profile Data (Bio, Banner, Badges)
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

    fetchLanyard();
    fetchProfile();

    // 3. WebSocket Connection for Realtime Presence
    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: ReturnType<typeof setInterval>;

    socket.onopen = () => {
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
        heartbeatInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
             socket.send(JSON.stringify({ op: 3 }));
          }
        }, interval);
      }
    };

    socket.onclose = () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      socket.close();
    };
  }, []);

  return { lanyard: data, profile };
};