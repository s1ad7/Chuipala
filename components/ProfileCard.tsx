import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LanyardData, DiscordProfile } from '../hooks/useLanyard';
import { Icons } from './Icons';

interface ProfileCardProps {
  lanyardData: LanyardData | null;
  profileData: DiscordProfile | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ lanyardData, profileData }) => {
  const user = lanyardData?.discord_user;
  const status = lanyardData?.discord_status || 'offline';
  
  // Data extraction
  const userId = user?.id || profileData?.user?.id;
  const username = user?.username || profileData?.user?.username || 'chuipala';
  const globalName = user?.global_name || profileData?.user?.global_name || username;
  
  // Clean Bio
  const cleanBio = (text: string | undefined) => {
    if (!text) return "No bio available.";
    return text
      .replace(/<a?:.+?:\d+>/g, '') 
      .replace(/(\*\*|__|~~|\|\||`)/g, '') 
      .trim();
  };

  const bio = cleanBio(profileData?.user?.bio);
  
  // Custom Status
  const customStatus = lanyardData?.activities?.find(a => a.type === 4);
  const statusMessage = customStatus?.state;

  // Assets
  const avatarHash = user?.avatar || profileData?.user?.avatar;
  const avatarFormat = avatarHash?.startsWith('a_') ? 'gif' : 'png';
  const avatarUrl = userId && avatarHash 
    ? `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${avatarFormat}?size=512` 
    : "https://picsum.photos/id/64/400/400";

  const decorationData = user?.avatar_decoration_data || profileData?.user?.avatar_decoration_data;
  const decorationUrl = decorationData?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationData.asset}.png?size=512`
    : null;

  const bannerHash = profileData?.user?.banner;
  const bannerFormat = bannerHash?.startsWith('a_') ? 'gif' : 'png';
  const bannerUrl = userId && bannerHash
    ? `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${bannerFormat}?size=1024`
    : null;
  const bannerColor = profileData?.user?.banner_color || '#111';

  // --- ACTIVITY LOGIC ---
  const [elapsedTime, setElapsedTime] = useState(0);
  // Find first activity that isn't Spotify (2) or Custom Status (4)
  const activity = lanyardData?.activities?.find(a => a.type !== 2 && a.type !== 4);

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

  const largeImage = activity ? getAssetUrl(activity.application_id, activity.assets?.large_image) : null;
  const smallImage = activity ? getAssetUrl(activity.application_id, activity.assets?.small_image) : null;


  // --- 3D TILT EFFECT LOGIC ---
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const statusColors = {
    online: 'bg-green-500 shadow-[0_0_10px_#22c55e]',
    idle: 'bg-yellow-500 shadow-[0_0_10px_#eab308]',
    dnd: 'bg-red-500 shadow-[0_0_10px_#ef4444]',
    offline: 'bg-gray-500 shadow-[0_0_10px_#6b7280]',
  };

  const statusText = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="w-full max-w-lg perspective-1000"
    >
      <div className="relative w-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group hover:shadow-[0_0_30px_rgba(164,2,2,0.15)] hover:border-[#A40202]/30">
        
        {/* Animated Border Gradient overlay on hover - UPDATED TO RED */}

        {/* Banner Area */}
        <div className="relative h-32 w-full bg-[#151515] overflow-hidden">
          {bannerUrl ? (
            <motion.img 
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-90" 
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: bannerColor }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]/90" />
        </div>

        {/* User Info Container */}
        <div className="relative px-5 pb-5">
          
          {/* Header: Avatar & Badges */}
          <div className="flex justify-between items-end -mt-14 mb-3">
            {/* Avatar Group */}
            <div className="relative">
              <div className="relative w-28 h-28 rounded-full border-[6px] border-[#0a0a0a] bg-[#0a0a0a] overflow-hidden z-10 shadow-lg">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>

              {/* Decoration */}
              {decorationUrl && (
                  <img 
                      src={decorationUrl} 
                      alt="Decoration"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-20 pointer-events-none drop-shadow-lg" 
                  />
              )}

              {/* Status */}
              <div className="absolute bottom-1 right-1 z-30 group/status">
                  <div className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full ${statusColors[status]} transition-colors duration-300`}></div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[10px] text-white rounded border border-white/10 opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {statusText[status]}
                  </div>
              </div>
            </div>

            {/* Badges */}
            {profileData?.badges && profileData.badges.length > 0 && (
               <div className="flex gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5 backdrop-blur-md mb-1">
                  {profileData.badges.map((badge, i) => {
                      const badgeIconUrl = badge.icon.startsWith('http') 
                          ? badge.icon 
                          : `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`;
                      
                      return (
                          <motion.div 
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="relative group/badge" 
                            title={badge.description}
                          >
                              <img src={badgeIconUrl} alt={badge.description} className="w-5 h-5 object-contain hover:scale-110 transition-transform cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[10px] text-white rounded border border-white/10 opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                  {badge.description}
                              </div>
                          </motion.div>
                      );
                  })}
               </div>
            )}
          </div>

          {/* Identity Section */}
          <div className="space-y-3">
              <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <span className="glitch" data-text={globalName}>{globalName}</span>
                      <span className="hidden sm:inline-block text-xs font-mono font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          @{username}
                      </span>
                  </h1>
                  <p className="text-gray-400 text-sm mt-1 font-medium flex items-center gap-2">
                      {statusMessage || "Roaming the network..."}
                  </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Bio */}
              <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 font-mono">Signal Data</h3>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium font-sans">
                      {bio}
                  </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Morocco</span>
              </div>

              {/* Divider for Activity */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-2" />

              {/* Integrated Activity Section - REVERTED TO HOVER-ONLY */}
              <div className="pt-1">
                 {activity ? (
                     <div className="flex items-start gap-4 p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:border-[#A40202]/30 transition-colors group/activity">
                        {/* Images */}
                        <div className="relative flex-shrink-0">
                           <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 border border-white/5">
                              {largeImage ? (
                                  <img src={largeImage} alt={activity.name} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#23272e]">
                                      <Icons.VSCode className="w-8 h-8" />
                                  </div>
                              )}
                           </div>
                           {smallImage && (
                              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0a0a0a] border-[2px] border-[#0a0a0a] flex items-center justify-center overflow-hidden">
                                  <img src={smallImage} alt="Small asset" className="w-full h-full object-cover" />
                              </div>
                           )}
                        </div>

                        {/* Activity Details */}
                        <div className="min-w-0 flex-1">
                           <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Currently Playing</h4>
                           <p className="text-sm font-bold text-[#A40202] truncate drop-shadow-[0_0_8px_rgba(164,2,2,0.4)] transition-colors">{activity.name}</p>
                           <p className="text-xs text-gray-300 truncate">{activity.details}</p>
                           <p className="text-xs text-gray-400 truncate">{activity.state}</p>
                           {activity.timestamps && (
                               <p className="text-[10px] text-gray-500 font-mono mt-1">{formatTime(elapsedTime)} elapsed</p>
                           )}
                        </div>
                     </div>
                 ) : (
                     <div className="flex items-center gap-3 opacity-60 px-2">
                        <Icons.Discord className="w-6 h-6 text-gray-600" />
                        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">No active game detected</span>
                     </div>
                 )}
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;