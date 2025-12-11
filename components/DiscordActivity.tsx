import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanyardData } from '../hooks/useLanyard';
import { Icons } from './Icons';

interface DiscordActivityProps {
  data: LanyardData | null;
}

const DiscordActivity: React.FC<DiscordActivityProps> = ({ data }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Safely find the first activity that isn't Spotify (2) or Custom Status (4)
  const activity = data?.activities?.find(a => a.type !== 2 && a.type !== 4);

  useEffect(() => {
    if (!activity?.timestamps?.start) {
        setElapsedTime(0);
        return;
    }

    const updateTime = () => {
        const start = activity.timestamps!.start;
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activity]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAssetUrl = (appId: string | undefined, assetId: string | undefined) => {
      if (!appId || !assetId) return null;
      if (assetId.startsWith('mp:')) {
          return `https://media.discordapp.net/${assetId.replace('mp:', '')}`;
      }
      return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  };

  if (!activity) {
      return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group w-full max-w-lg"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-xl">
                <div className="w-20 h-20 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-white/5 shadow-inner">
                    <Icons.Discord className="w-10 h-10 text-gray-700 group-hover:text-[#A40202] transition-colors duration-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors">No Active Status</h3>
                    <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors mt-1 font-mono">
                        {data ? "System Idle..." : "Connecting..."}
                    </p>
                </div>
            </div>
        </motion.div>
      );
  }

  const largeImage = getAssetUrl(activity.application_id, activity.assets?.large_image);
  const smallImage = getAssetUrl(activity.application_id, activity.assets?.small_image);

  return (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative group w-full max-w-lg"
    >
      {/* Glowing Backdrop - REVERTED TO HOVER ONLY */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A40202] to-[#FF4655] rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
      
      {/* Card Body - REVERTED TO HOVER ONLY BORDER */}
      <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-2xl group-hover:border-[#A40202]/50 transition-colors duration-300">
        
        {/* Large Image (Rich Presence Asset) */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {largeImage ? (
                 <img src={largeImage} alt={activity.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#23272e]">
                     <Icons.VSCode className="w-10 h-10" />
                </div>
            )}
          </div>
          
          {/* Small Badge Image */}
          {smallImage && (
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#111] border-[3px] border-[#0a0a0a] flex items-center justify-center overflow-hidden shadow-lg" title={activity.assets?.small_text}>
               <img src={smallImage} alt="Small asset" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-[#A40202] transition-colors">
            {activity.name}
          </h3>
          <p className="text-xs text-gray-300 font-semibold mt-0.5 truncate">{activity.details}</p>
          <p className="text-xs text-gray-400 mt-1 truncate">{activity.state}</p>
          
          {/* Timestamp Text Only */}
          {activity.timestamps && (
             <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#A40202]/10 border border-[#A40202]/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#A40202] animate-pulse" />
                 <p className="text-[10px] text-[#A40202] font-mono font-bold uppercase">{formatTime(elapsedTime)} elapsed</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DiscordActivity;