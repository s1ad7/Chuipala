import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';

const socialLinks = [
  { name: 'Discord', icon: Icons.Discord, url: 'https://discord.gg/4em4zAqqAg', color: 'hover:text-[#5865F2] hover:drop-shadow-[0_0_10px_#5865F2]' },
  { name: 'Twitch', icon: Icons.Twitch, url: 'https://twitch.tv/chuipal1', color: 'hover:text-[#9146FF] hover:drop-shadow-[0_0_10px_#9146FF]' },
  { name: 'TikTok', icon: Icons.TikTok, url: 'https://tiktok.com/@chuipal1', color: 'hover:text-[#ff0050] hover:drop-shadow-[0_0_10px_#ff0050]' },
  { name: 'Instagram', icon: Icons.Instagram, url: 'https://instagram.com/s1ad_7', color: 'hover:text-[#E1306C] hover:drop-shadow-[0_0_10px_#E1306C]' },
  { name: 'X', icon: Icons.X, url: 'https://x.com/ifS1ad', color: 'hover:text-white hover:drop-shadow-[0_0_10px_#ffffff]' },
  { name: 'Steam', icon: Icons.Steam, url: 'https://steamcommunity.com/id/CyberVirus741/', color: 'hover:text-[#66c0f4] hover:drop-shadow-[0_0_10px_#66c0f4]' },
  { name: 'Spotify', icon: Icons.Spotify, url: 'https://open.spotify.com/user/31q2e4fdnfuxq7y2blakeegzc4oi?si=6e0a2a6a914e4fa1', color: 'hover:text-[#1DB954] hover:drop-shadow-[0_0_10px_#1DB954]' },
  { name: 'GitHub', icon: Icons.GitHub, url: 'https://github.com/s1ad7', color: 'hover:text-white hover:drop-shadow-[0_0_10px_#ffffff]' },
];

const SocialLinks: React.FC = () => {
  return (
    <motion.div 
      className="w-full max-w-lg flex flex-wrap justify-center gap-6 sm:gap-8"
    >
      {socialLinks.map((social, i) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + (i * 0.05) }}
          className={`relative text-gray-500 transition-all duration-300 ${social.color}`}
          whileHover={{ y: -3, scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          title={social.name}
        >
          <social.icon className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialLinks;