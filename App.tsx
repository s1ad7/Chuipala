import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ProfileCard from './components/ProfileCard';
import ValorantCard from './components/ValorantCard';
import SocialLinks from './components/SocialLinks';
import MusicPlayer from './components/MusicPlayer';
import Background from './components/Background';
import Favorites from './components/Favorites';
import SuggestionBox from './components/SuggestionBox';
import ChatBot from './components/ChatBot';
import Loader from './components/Loader';
import { useLanyard } from './hooks/useLanyard';

const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { lanyard, profile } = useLanyard();

  // Handle Loader & Data Fetching
  useEffect(() => {
    // Wait for window load and minimum animation time
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 3500)); // Adjusted to match new loader duration
    const dataPromise = new Promise(resolve => {
        // Fallback: if data takes too long (e.g. 5s), proceed anyway
        const fallback = setTimeout(resolve, 5000); 
        
        // Simple check interval for data or window load
        const checkInterval = setInterval(() => {
            if (lanyard || profile || document.readyState === 'complete') {
                clearInterval(checkInterval);
                clearTimeout(fallback);
                resolve(true);
            }
        }, 500);
    });

    Promise.all([minTimePromise, dataPromise]).then(() => {
        setIsLoading(false);
    });
  }, [lanyard, profile]);

  // Audio Playback Logic
  useEffect(() => {
    if (!isLoading && audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Auto-play prevented by browser policy:", error);
                setIsMuted(true); // Mute if auto-play blocked so user can unmute manually
            });
        }
    }
  }, [isLoading]);

  // Volume Change Logic
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
          setIsMuted(false);
      }
      if (newVolume === 0) {
          setIsMuted(true);
      }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden text-white selection:bg-red-500/30 pb-20">
      
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        muted={isMuted}
        preload="auto"
        playsInline
        src="/Gibran Alcocer - Idea 10.mp3" 
      />

      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      <Background />

      {/* Top Left Volume Control */}
      {!isLoading && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-6 left-6 z-50 flex items-center bg-black/40 backdrop-blur-md rounded-full border border-white/5 p-1.5 pr-2 transition-all duration-300 hover:bg-black/80 hover:border-white/20 hover:pr-4 group"
      >
        <button
            onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                if (!next && audioRef.current) {
                    audioRef.current.play().catch(() => {});
                }
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative flex-shrink-0"
        >
             {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
             ) : (
                <Volume2 className="w-5 h-5 text-[#FF4655] group-hover:text-white transition-colors" />
             )}
        </button>

        {/* Volume Slider - Revealed on Hover */}
        <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-out flex items-center opacity-0 group-hover:opacity-100">
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                    handleVolumeChange(e);
                    const newVolume = parseFloat(e.target.value);
                    if (newVolume > 0 && audioRef.current) {
                        audioRef.current.play().catch(() => {});
                    }
                }}
                className="w-20 h-1 ml-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#FF4655] focus:outline-none focus:ring-1 focus:ring-[#FF4655]/50"
            />
        </div>
      </motion.div>
      )}

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-5xl px-4 pt-16 flex flex-col items-center gap-12">
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full flex flex-col gap-12"
            >
              
              {/* SECTION 1: Profile & Socials */}
              <div className="flex flex-col items-center gap-8">
                {/* Profile Header (Centered) */}
                <motion.div variants={itemVariants} className="w-full flex justify-center">
                    <ProfileCard lanyardData={lanyard} profileData={profile} />
                </motion.div>

                {/* Social Icons (Centered below profile) */}
                <motion.div variants={itemVariants} className="w-full flex justify-center">
                    <SocialLinks />
                </motion.div>
              </div>

              {/* SECTION 2: Status Grid (Spotify & Valorant) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Left: Spotify */}
                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                     <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 pl-1">Listen with me</h3>
                     <div className="h-full min-h-[200px]">
                        <MusicPlayer isMuted={isMuted} spotifyData={lanyard?.spotify} />
                     </div>
                </motion.div>

                {/* Right: Valorant */}
                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                     <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 pl-1">Play with me</h3>
                     <div className="h-full min-h-[200px]">
                        <ValorantCard />
                     </div>
                </motion.div>
              </div>

              {/* SECTION 3: Favorites */}
              <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 pl-1">My Suggestions</h3>
                  <Favorites />
              </motion.div>

              {/* SECTION 4: Suggestions */}
              <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 pl-1 text-center">Mark your presence — suggest or contact</h3>
                  <SuggestionBox />
              </motion.div>

              {/* Footer Quote */}
              <motion.div variants={itemVariants} className="text-center mt-8 opacity-60 hover:opacity-100 transition-opacity">
                  <p className="font-serif italic text-lg text-gray-300">
                    “True love begins when nothing is looked for in return.”
                  </p>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#FF4655] mt-2">
                    — Antoine de Saint-Exupéry
                  </p>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Chat Bot Overlay */}
      <ChatBot />
      
    </div>
  );
};

export default App;
