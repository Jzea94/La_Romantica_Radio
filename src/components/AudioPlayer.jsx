import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";

const AudioPlayer = ({ streamUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [trackInfo, setTrackInfo] = useState({
    title: "Salsa Romántica FM",
    artist: "En Vivo 24/7"
  });

  // Detección de iPhone (iOS bloquea el control de volumen por software)
  const isIPhone = typeof window !== 'undefined' && /iPhone/.test(navigator.userAgent);

  const audioRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const streamId = streamUrl.split('/').pop();

  // 1. Detección de desbordamiento para el Marquee
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && containerRef.current) {
        const isOverflowing = titleRef.current.scrollWidth > containerRef.current.offsetWidth;
        setShouldAnimate(isOverflowing);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [trackInfo.title]);

  // 2. Metadatos via Zeno FM (SSE)
  useEffect(() => {
    const sseUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${streamId}`;
    const eventSource = new EventSource(sseUrl);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, ...titleParts] = data.streamTitle.split(" - ");
          setTrackInfo({
            artist: artist?.trim() || "Salsa Romántica",
            title: titleParts.join(" - ")?.trim() || artist?.trim()
          });
        }
      } catch (err) {
        console.error("Error al procesar metadatos:", err);
      }
    };
    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, [streamId]);

  // 3. Lógica de Audio
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
    }
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = ""; 
      audioRef.current = null; 
      setIsPlaying(false);
    } else {
      audioRef.current.src = streamUrl;
      // En iPhone, el volumen siempre es 1 (control físico obligatorio)
      audioRef.current.volume = isIPhone ? 1 : (isMuted ? 0 : volume[0] / 100);
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolume = (newVal) => {
    setVolume(newVal);
    const muted = newVal[0] === 0;
    setIsMuted(muted);
    if (audioRef.current && !isIPhone) {
      audioRef.current.volume = muted ? 0 : newVal[0] / 100;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      // El iPhone sí respeta la propiedad .muted aunque bloquee el .volume
      audioRef.current.muted = nextMute;
      if (!isIPhone) audioRef.current.volume = nextMute ? 0 : volume[0] / 100;
    }
  };

  return (
    <div className="glass border rounded-xl p-4 shadow-2xl backdrop-blur-md max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* COLUMNA 1: Play/Pause */}
        <div className="flex-shrink-0">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,46,126,0.4)]"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* COLUMNA 2: Info de la canción */}
        <div className="min-w-0 flex flex-col justify-center space-y-0.5">
          <div className="overflow-hidden relative w-full" ref={containerRef}>
            <p 
              ref={titleRef}
              className={`inline-block text-sm font-bold neon-text whitespace-nowrap ${
                shouldAnimate ? "animate-marquee hover:pause-marquee" : ""
              }`}
            >
              {trackInfo.title}
            </p>
          </div>
          <p className="text-xs text-muted-foreground truncate italic">
            {trackInfo.artist}
          </p>
          <div className="h-4 mt-1">
            {isPlaying && (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#ff2e7e]" />
                <span className="text-[10px] uppercase tracking-wider font-medium text-primary/80">
                  En vivo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 3: Volumen (Oculta slider en iPhone) */}
        <div className={`flex items-center gap-3 flex-shrink-0 ${isIPhone ? 'w-auto' : 'w-[120px] md:w-[160px]'}`}>
          <button 
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={isIPhone ? "Silenciar" : "Volumen"}
          >
            {isMuted || (!isIPhone && volume[0] === 0) ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          
          {!isIPhone && (
            <Slider 
              value={isMuted ? [0] : volume} 
              onValueChange={handleVolume} 
              max={100} 
              step={1} 
              className="cursor-pointer"
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default AudioPlayer;