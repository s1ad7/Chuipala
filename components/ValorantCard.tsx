import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Trophy, Swords, Copy, Check } from 'lucide-react';

// Interfaces for API response
interface ValorantData {
  current_data: {
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
  };
  highest_rank: {
    patched_tier: string;
    season: string;
  };
}

const ValorantCard: React.FC = () => {
  const [data, setData] = useState<ValorantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const username = "TTV Chuipal1#711";

  useEffect(() => {
    const fetchValoStats = async () => {
      try {
        // Using HenrikDev API (Unofficial Valorant API)
        const response = await fetch('https://api.henrikdev.xyz/valorant/v1/mmr/eu/TTV%20Chuipal1/711');
        const json = await response.json();
        
        if (json.data) {
          setData(json.data);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        // Fallback data
        setData({
          current_data: {
            currenttier: 24, // Immortal 1
            currenttierpatched: 'Immortal 1',
            images: {
              small: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/smallicon.png',
              large: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png'
            },
            ranking_in_tier: 45,
            mmr_change_to_last_game: 18,
            elo: 2145
          },
          highest_rank: {
            patched_tier: 'Immortal 3',
            season: 'E8:A2'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchValoStats();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  // Background Image (Ascent Map Splash for consistent vibe)
  const bgImage = 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-full h-full min-h-[180px] bg-[#000000]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group flex flex-col justify-center"
    >
      {/* Ambient Background */}
      <div 
        className="absolute inset-0 opacity-20 blur-[2px] scale-110 transition-transform duration-700 group-hover:scale-125"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      
      {/* Red/Valorant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4655]/10 to-transparent mix-blend-overlay" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Top Decoration Line (Full Width) */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-20">
        <motion.div 
            className="h-full bg-[#FF4655] shadow-[0_0_15px_#FF4655]"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative flex items-center gap-5 px-5 py-5 z-10">
        
        {/* Rank Icon with Glow Effect */}
        <div className="relative group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
             <div className="absolute inset-0 bg-[#FF4655] blur-[25px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
             <motion.img 
                initial={{ y: 5 }}
                animate={{ y: -5 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                src={data?.current_data.images.large} 
                alt="Rank" 
                className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl z-10"
             />
        </div>

        {/* Stats Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            
            {/* Clickable Username */}
            <button 
                onClick={handleCopy}
                className="group/copy w-fit flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FF4655]/50 px-2 py-1 rounded transition-all mb-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF4655]/50"
                title="Click to copy username"
            >
                <span className="text-[10px] sm:text-xs font-bold text-gray-200 group-hover/copy:text-white transition-colors font-mono">
                    {username}
                </span>
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check className="w-3 h-3 text-green-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Copy className="w-3 h-3 text-gray-500 group-hover/copy:text-[#FF4655]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            <h2 className="text-white text-xl sm:text-2xl font-bold font-mono uppercase tracking-tight leading-none group-hover:text-[#FF4655] transition-colors duration-300">
               {data?.current_data.currenttierpatched}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5">
                    <span className="text-white font-bold">{data?.current_data.ranking_in_tier}</span> 
                    <span className="text-[10px] uppercase">RR</span>
                </div>
                
                <div className="w-px h-3 bg-white/20 hidden sm:block" />

                <div className="flex items-center gap-1.5" title="Peak Rank">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span>Peak: <span className="text-gray-300">{data?.highest_rank.patched_tier}</span></span>
                </div>
            </div>
        </div>

        {/* Elo Badge */}
        <div className="hidden sm:flex flex-col items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">ELO</span>
            <span className="text-sm font-mono text-gray-300">{data?.current_data.elo}</span>
        </div>

      </div>
    </motion.div>
  );
};

export default ValorantCard;