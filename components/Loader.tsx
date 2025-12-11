import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Wifi } from 'lucide-react';

const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING SYSTEM...');

  useEffect(() => {
    const duration = 2500; // Total loading time roughly
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      // Text sequence based on progress
      if (newProgress < 30) setText('ESTABLISHING CONNECTION...');
      else if (newProgress < 60) setText('BYPASSING FIREWALLS...');
      else if (newProgress < 85) setText('FETCHING BIOMETRICS...');
      else setText('ACCESS GRANTED');

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono text-white overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Garage Door Bottom Edge (Glowing Line) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.8)] z-50" />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,70,85,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,70,85,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center gap-8">
        
        {/* Animated Icon */}

        {/* Glitch Text */}
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold tracking-widest glitch" data-text="CHUIPALA">
                CHUIPALA
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#FF4655] tracking-[0.2em] h-5">
                <Terminal className="w-3 h-3 animate-pulse" />
                <span>{text}</span>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
                className="absolute top-0 left-0 h-full bg-[#FF4655] shadow-[0_0_15px_#FF4655]"
                style={{ width: `${progress}%` }}
            />
        </div>


      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-[10px] text-gray-600 font-mono flex gap-8">
          <span>ID: 1019243841498394654</span>
          <span>LOC: MOROCCO</span>
      </div>

    </motion.div>
  );
};

export default Loader;