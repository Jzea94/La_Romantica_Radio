import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ChevronDown, Radio } from "lucide-react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useZenoMetadata } from "@/hooks/useZenoMetadata";

// --- COMPONENTE AUXILIAR PARA EL DESPLAZAMIENTO ---
const MarqueeText = ({ text, className }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      // Solo animamos si el texto es realmente más largo que el contenedor
      setShouldAnimate(textRef.current.offsetWidth > containerRef.current.offsetWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden whitespace-nowrap">
      <motion.div
        ref={textRef}
        className={`inline-block ${className}`}
        animate={shouldAnimate ? { x: [0, "-50%"] } : { x: 0 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
      >
        {/* Renderizamos el texto dos veces para el efecto de bucle infinito */}
        <span>{text}</span>
        {shouldAnimate && <span className="ml-10">{text}</span>}
      </motion.div>
    </div>
  );
};

const AudioPlayer = ({ streamUrl, currentTrack, onBackToLive, onNext, onPrevious, isExpanded, setIsExpanded }) => {
  const { isPlaying, isMuted, setIsMuted, togglePlay } = useAudioEngine(streamUrl, currentTrack);
  const trackInfo = useZenoMetadata(streamUrl, currentTrack);

  const isLive = !currentTrack;
  const coverImage = !isLive ? currentTrack.path_cover : "https://laromanticaradio.com.co/romantica1.jpg";
  const displayTitle = isLive ? trackInfo.title : currentTrack.title;
  const displayArtist = isLive ? trackInfo.artist : currentTrack.artist;

  return (
    <>
      {/* --- VISTA EXPANDIDA --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => info.offset.y > 100 && setIsExpanded(false)}
            className="fixed inset-0 z-110 bg-[#0B0B0F] flex flex-col p-8 pb-25 md:pb-10"
          >
            <button onClick={() => setIsExpanded(false)} className="self-start mb-8 opacity-50">
              <ChevronDown size={32} />
            </button>

            <div className="flex flex-col items-start justify-center gap-4">
              <img 
                src={coverImage} 
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl mt-8 max-h-[50vh]" 
                alt="cover" 
              />
              <div className="text-start px-2 mt-15 w-full">
                {/* Título con Marquee en vista expandida */}
                <MarqueeText 
                  text={displayTitle} 
                  className="text-2xl md:text-3xl font-black text-white leading-tight" 
                />
                <p className="tracking-widest text-ms md:text-base text-white/70">
                  {displayArtist}
                </p>
              </div>
            </div>

            <div className="w-full bg-white/10 h-1 rounded-full mt-5 overflow-hidden shrink-0">
               <motion.div 
                className="bg-primary h-full" 
                animate={{ width: isPlaying ? "100%" : "0%" }} 
                transition={{ duration: 30, ease: "linear" }}
               />
            </div>

            <div className="flex items-center justify-between px-4 mt-9">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/70">
                {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
              </button>
              
              <div className="flex items-center gap-8">
                {!isLive && (
                  <button onClick={onPrevious} className="text-white active:scale-75 transition-transform">
                    <SkipBack size={35} fill="currentColor" />
                  </button>
                )}
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" />}
                </button>
                {!isLive && (
                  <button onClick={onNext} className="text-white active:scale-75 transition-transform">
                    <SkipForward size={35} fill="currentColor" />
                  </button>
                )}
              </div>
              <div className="w-7" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MINI PLAYER --- */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="relative glass border border-white/10 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
        >
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-2">
            <img src={coverImage} className="w-10 h-10 rounded-lg object-cover bg-black/40" alt="mini-cover" />

            <div className="min-w-0 flex flex-col justify-center overflow-hidden">
              {/* Marquee para el título en la mini barra */}
              <MarqueeText 
                text={displayTitle} 
                className="text-sm font-bold text-white leading-tight" 
              />
              <p className="text-[12px] text-white/50 truncate">
                {displayArtist}
              </p>
            </div>

            {!isLive && (
              <button 
                onClick={(e) => { e.stopPropagation(); onBackToLive(); }}
                className="flex items-center justify-center p-2 text-primary hover:bg-white/5 rounded-full transition-colors animate-pulse"
                title="Volver al LIVE"
              >
                <Radio size={20} />
              </button>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 flex items-center justify-center text-white"
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
            <motion.div 
              className="h-full bg-primary" 
              animate={{ width: isPlaying ? "40%" : "0%" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;