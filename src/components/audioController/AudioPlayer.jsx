import React, { useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronDown, Radio, Play, Pause } from "lucide-react";

// Hooks
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useZenoMetadata } from "@/hooks/useZenoMetadata";

// Sub-componentes
import MarqueeText from "./MarqueeText";
import PlayerContent from "./PlayerContent";
import PlayerControls from "./PlayerControls";

const AudioPlayer = ({ 
  streamUrl, 
  currentTrack, 
  onBackToLive, 
  onNext, 
  onPrevious, 
  isExpanded, 
  setIsExpanded 
}) => {
  const { isPlaying, isMuted, setIsMuted, togglePlay } = useAudioEngine(streamUrl, currentTrack);
  const zenoData = useZenoMetadata(streamUrl, currentTrack);

  const dragY = useMotionValue(0);

  /**
   * OPACIDAD Y ESCALA:
   * - contentOpacity: disminuye mientras arrastras hacia abajo
   * - miniPlayerOpacity: aumenta mientras arrastras hacia abajo
   * Ambos son independientes del estado isExpanded
   */
  const contentOpacity = useTransform(dragY, [0, 400], [1, 0]);
  const scale = useTransform(dragY, [0, 400], [1, 0.9]);
  
  // Opacidad inversa para el MiniPlayer: aparecerá a medida que arrastramos hacia abajo
  const miniPlayerOpacity = useTransform(dragY, [0, 200], [0, 1]);

  const sharedSpring = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 };

  const isLive = !currentTrack;
  
  const displayInfo = useMemo(() => ({
    title: isLive ? (zenoData?.title || "La Romántica Radio") : currentTrack.title,
    artist: isLive ? (zenoData?.artist || "Cargando señal...") : currentTrack.artist,
    cover: isLive ? "https://laromanticaradio.com.co/romantica1.jpg" : currentTrack.path_cover
  }), [isLive, currentTrack, zenoData]);

  const handleDragEnd = (_, info) => {
    if (info.velocity.y > 500 || info.offset.y > 150) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div 
            key="expanded-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={sharedSpring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={handleDragEnd}
            style={{ y: dragY }} 
            className="fixed inset-0 z-110 bg-[#0B0B0F] flex flex-col p-6 pb-24 touch-none overflow-hidden will-change-transform"
          >
            {/* Animamos la opacidad de los elementos internos individualmente */}
            <motion.div style={{ opacity: contentOpacity }} className="flex flex-col h-full">
              <div className="w-12 h-1.5 bg-white/10 rounded-full self-center mb-8 shrink-0" />
              
              <button 
                onClick={() => setIsExpanded(false)} 
                className="self-start p-2 -mt-4 opacity-50 hover:opacity-100 transition-opacity"
              >
                <ChevronDown size={32} className="text-white" />
              </button>

              <motion.div style={{ scale }} className="flex-1 flex flex-col">
                <PlayerContent info={displayInfo} isLive={isLive} />
              </motion.div>
              
              <PlayerControls 
                isPlaying={isPlaying} 
                isLive={isLive}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onPlayPause={togglePlay}
                onNext={onNext}
                onPrevious={onPrevious}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MiniPlayer: solo renderiza cuando NO está expandido */}
      {!isExpanded && (
        <motion.div 
          key="mini-player"
          onClick={() => setIsExpanded(true)}
          transition={sharedSpring}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer p-2.5 mx-2"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
            >
              <img src={displayInfo.cover} className="w-full h-full object-cover" alt="mini-cover" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <MarqueeText text={displayInfo.title} className="text-sm font-bold text-white tracking-tight" />
              <p className="text-[11px] text-white/40 truncate font-medium">{displayInfo.artist}</p>
            </div>

            <div className="flex items-center gap-2">
              {!isLive && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onBackToLive(); }} 
                  className="p-2 text-primary"
                >
                  <Radio size={20} className="animate-pulse" />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AudioPlayer;