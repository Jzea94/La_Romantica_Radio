import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { Slider } from "./ui/slider";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useZenoMetadata } from "@/hooks/useZenoMetadata";

const AudioPlayer = ({ streamUrl, currentTrack, onBackToLive }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  // Consumimos nuestros Hooks
  const { 
    isPlaying, isMuted, setIsMuted, volume, 
    handleVolumeChange, togglePlay, isIPhone 
  } = useAudioEngine(streamUrl, currentTrack);

  const trackInfo = useZenoMetadata(streamUrl, currentTrack);

  // Efecto visual para el Marquee
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && containerRef.current) {
        setShouldAnimate(titleRef.current.scrollWidth > containerRef.current.offsetWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [trackInfo.title]);

  return (
    <div className="glass border rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-4xl mx-auto w-full border-white/10">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* Play/Pause */}
        <div className="shrink-0">
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-all shadow-neon"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        </div>

        {/* Info */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="overflow-hidden relative w-full" ref={containerRef}>
            <p ref={titleRef} className={`inline-block text-base font-bold neon-text whitespace-nowrap ${shouldAnimate ? "animate-marquee" : ""}`}>
              {trackInfo.title}
            </p>
          </div>
          
          <div className="flex flex-col items-start space-y-1">
            <p className="text-xs text-muted-foreground truncate italic">{trackInfo.artist}</p>
            
            {currentTrack && (
              <button 
                onClick={onBackToLive}
                className="flex items-center gap-1 text-[9px] bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30 transition-all border border-primary/20 animate-in slide-in-from-left-2"
              >
                <Radio size={10} /> Volver al LIVE
              </button>
            )}

            {isPlaying && !currentTrack && (
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Live Stream</span>
              </div>
            )}
          </div>
        </div>

        {/* Volumen */}
        <div className={`flex items-center gap-3 ${isIPhone ? 'w-auto' : 'w-30 md:w-40'}`}>
          <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-primary transition-colors">
            {isMuted || volume[0] === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          {!isIPhone && (
            <Slider value={isMuted ? [0] : volume} onValueChange={handleVolumeChange} max={100} step={1} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;