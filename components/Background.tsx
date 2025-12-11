import React from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden bg-[#050505]">
      
      {/* Animated Deep Red Pulse */}
      <div className="absolute inset-0 z-0">
         <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,#3b0000_0%,transparent_60%)]" 
         />
      </div>

      {/* Slowly Panning Cityscape */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ 
            scale: 1.15, 
            x: [-10, 0, -10],
            y: [-5, 0, -5]
        }}
        transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "linear" 
        }}
        className="absolute inset-0 opacity-25 bg-center bg-cover bg-no-repeat grayscale contrast-125 mix-blend-screen z-1"
        style={{ 
          backgroundImage: `url('https://r2.guns.lol/44e91093-1868-4e8f-beda-c22f5149e508.webp')` 
        }}
      />
      
      {/* Moving Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] z-10" />

      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none z-20 opacity-60" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-30" />

      {/* Animated Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] brightness-100 mix-blend-overlay z-40 animate-noise"></div>
    </div>
  );
};

export default Background;