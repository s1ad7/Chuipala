import React from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Gamepad2, ArrowUpRight } from 'lucide-react';

const favorites = [
  {
    type: 'Movie',
    title: 'Nightcrawler',
    year: '2014',
    icon: Film,
    link: 'https://www.imdb.com/title/tt2872718/',
    image: 'https://m.media-amazon.com/images/M/MV5BYjMwMmI5MWQtOTU4OS00OTAyLTg0OTYtNmQ5YzExZTQ3ZWJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 
    color: 'text-yellow-400',
    accent: 'bg-yellow-400',
    shadow: 'shadow-yellow-400/50',
    overlay: 'from-yellow-500/20',
    description: 'A desperate loner muscles into the world of L.A. crime journalism.'
  },
  {
    type: 'TV Show',
    title: 'Bodyguard',
    year: '2018',
    icon: Tv,
    link: 'https://www.netflix.com/title/80235864',
    image: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/09/23/20/bodyguard-bbc.jpg?width=1200&height=1200&fit=crop',
    color: 'text-blue-400',
    accent: 'bg-blue-400',
    shadow: 'shadow-blue-400/50',
    overlay: 'from-blue-500/20',
    description: 'A war veteran is assigned to protect a politician whose politics he despises.'
  },
  {
    type: 'Game',
    title: 'Valorant',
    year: '2020',
    icon: Gamepad2,
    link: 'https://playvalorant.com/',
    image: 'https://images.wallpapersden.com/image/download/valorant-hd-gaming_bWZpaGyUmZqaraWkpJRmbmdlrWZlbWU.jpg',
    color: 'text-[#FF4655]',
    accent: 'bg-[#FF4655]',
    shadow: 'shadow-[#FF4655]/50',
    overlay: 'from-[#FF4655]/20',
    description: 'A 5v5 character-based tactical shooter game.'
  }
];

const Favorites: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {favorites.map((item, index) => (
        <motion.a
          key={item.title}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="relative group flex flex-col h-[400px] w-full bg-[#000000]/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-white/20"
        >
            {/* Full Background Image */}
            <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ 
                    backgroundImage: `url(${item.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            />
            
            {/* Colored Ambient Overlay (Matches Valorant/Spotify vibe) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.overlay} to-transparent mix-blend-overlay opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Dark Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] z-20 bg-white/5">
                 <div className={`h-full ${item.accent} w-0 group-hover:w-full transition-all duration-500 ease-out shadow-[0_0_15px_currentColor]`} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full p-6 justify-between">
                
                {/* Header: Type Badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md shadow-lg group-hover:bg-white/10 transition-colors">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${item.color} drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>{item.type}</span>
                    </div>
                    
                    <span className="text-xs font-mono text-gray-400 bg-black/40 px-2 py-1 rounded-md border border-white/5 backdrop-blur-md shadow-sm">
                        {item.year}
                    </span>
                </div>

                {/* Footer Info */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-gray-100 transition-colors flex items-center gap-2 drop-shadow-md">
                        {item.title}
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400" />
                    </h3>
                    
                    {/* Animated divider with glow */}
                    <div className={`w-8 h-1 ${item.accent} rounded-full mb-2 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ${item.shadow}`} />

                    <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed font-medium drop-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.a>
      ))}
    </div>
  );
};

export default Favorites;