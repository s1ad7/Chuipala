import React, { useState, useEffect, useRef } from 'react';
import { Music, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanyardData } from '../hooks/useLanyard';
import { Icons } from './Icons';

interface MusicPlayerProps {
  isMuted: boolean;
  spotifyData: LanyardData['spotify'] | undefined;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isMuted, spotifyData }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (spotifyData) {
        setIsPlaying(true);
        const start = spotifyData.timestamps.start;
        const end = spotifyData.timestamps.end;
        const totalDuration = (end - start) / 1000;
        setDuration(totalDuration);

        // Update progress immediately
        const updateProgress = () => {
            const now = Date.now();
            const current = (now - start) / 1000;
            setProgress(Math.min(current, totalDuration));
        };
        
        updateProgress();
        timerRef.current = setInterval(updateProgress, 1000);
    } else {
        setIsPlaying(false);
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [spotifyData]);

  const handleJoin = () => {
    if (spotifyData?.track_id) {
        window.open(`https://open.spotify.com/track/${spotifyData.track_id}`, '_blank');
    }
  };

  // If no spotify data (Offline State matching ValorantCard container)
  if (!spotifyData) {
      return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative w-full h-full min-h-[180px] bg-[#000000]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group flex flex-col justify-center"
        >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Disc className="w-6 h-6 text-gray-500" />
                 </div>
                 <div>
                    <h4 className="text-white text-sm font-bold">Offline</h4>
                    <p className="text-xs text-gray-500 font-mono">Spotify is currently idle</p>
                 </div>
              </div>
           </div>
        </motion.div>
      );
  }

  return (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative w-full h-full min-h-[180px] bg-[#000000]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group flex flex-col justify-between"
    >
      {/* Ambient Background from Album Art (Matches ValorantCard style) */}
      <div 
        className="absolute inset-0 opacity-40 blur-[2px] scale-110 transition-transform duration-700 group-hover:scale-125"
        style={{ 
            backgroundImage: `url(${spotifyData.album_art_url})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
        }}
      />
      
      {/* Gradient Overlay (Green tint for Spotify) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/20 to-transparent mix-blend-overlay" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Progress Bar (Acts as the top decoration line) */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-20">
        <motion.div 
            className="h-full bg-[#1DB954] shadow-[0_0_15px_#1DB954]"
            initial={{ width: '0%' }}
            animate={{ width: `${(progress / duration) * 100}%` }}
            transition={{ ease: "linear", duration: 1 }}
        >
             {/* Small white dot at end of progress bar */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>

      <div className="relative flex flex-col p-5 z-10 h-full justify-between">
        
        <div className="flex items-center gap-5">
            {/* Album Art (Square with shadow, similar to Rank Icon container) */}
            <div className="relative group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                <div className="absolute inset-0 bg-[#1DB954] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <img 
                    src={spotifyData.album_art_url} 
                    alt={spotifyData.album} 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow-2xl border border-white/10 z-10" 
                />
                 {/* Floating Icon */}
                <div className="absolute -bottom-2 -right-2 bg-[#1DB954] text-black rounded-full p-1 shadow-lg z-20 border border-black/20">
                    <Music className="w-3 h-3" />
                </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_8px_#1DB954]" />
                     <span className="text-[10px] text-[#1DB954] font-bold tracking-widest uppercase">Now Playing</span>
                </div>
                
                <h2 className="text-white text-lg sm:text-xl font-bold leading-tight truncate group-hover:text-[#1DB954] transition-colors duration-300">
                    {spotifyData.song}
                </h2>
                <p className="text-sm text-gray-300 truncate font-medium opacity-90">
                    {spotifyData.artist}
                </p>
            </div>
        </div>

        {/* Join Button - Bottom aligned */}
        <button 
            onClick={handleJoin}
            className="w-full mt-4 py-2 px-3 bg-[#1DB954]/20 hover:bg-[#1DB954] border border-[#1DB954]/50 hover:border-[#1DB954] text-[#1DB954] hover:text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider group/btn backdrop-blur-md"
        >
            <Icons.Spotify className="w-4 h-4 fill-current transition-colors" />
            Join Listening
        </button>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;