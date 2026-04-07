import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { Slider } from "./ui/slider";

const AudioPlayer = ({ streamUrl, currentTrack, onBackToLive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const [trackInfo, setTrackInfo] = useState({
    title: "Salsa Romántica FM",
    artist: "En Vivo 24/7"
  });

  const isIPhone = typeof window !== 'undefined' && /iPhone/.test(navigator.userAgent);
  const audioRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const streamId = streamUrl.split('/').pop();

  // 1. SINCRONIZACIÓN DE MUTE Y VOLUMEN (Corrección solicitada)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      // En iOS el volumen es físico, en otros sistemas aplicamos el estado
      if (!isIPhone) {
        audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
      }
    }
  }, [isMuted, volume]);

  // 2. REPRODUCCIÓN AUTOMÁTICA AL CAMBIAR DE TRACK
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";

    const loadAndPlay = async () => {
      audio.pause();
      
      if (currentTrack) {
        audio.src = currentTrack.audioUrl;
        setTrackInfo({ title: currentTrack.title, artist: currentTrack.artist });
      } else {
        // Al volver al vivo, limpiamos si no está sonando para no consumir datos
        audio.src = isPlaying ? streamUrl : "";
        setTrackInfo({ title: "Salsa Romántica FM", artist: "En Vivo 24/7" });
      }

      // Si hay un track nuevo, forzamos el Play y actualizamos el estado visual
      if (currentTrack || isPlaying) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Autoplay prevent: ", err);
          setIsPlaying(false);
        }
      }
    };

    loadAndPlay();
  }, [currentTrack]);

  // 3. METADATOS SSE (Solo Radio)
  useEffect(() => {
    if (currentTrack) return;
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
      } catch (err) { console.error("Metadata error:", err); }
    };

    return () => eventSource.close();
  }, [streamId, currentTrack]);

  // 4. LÓGICA DE CONTROLES
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (!currentTrack) audio.src = ""; 
      setIsPlaying(false);
    } else {
      if (!currentTrack) audio.src = streamUrl;
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolume = (v) => {
    setVolume(v);
    if (v[0] === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  return (
    <div className="glass border rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-4xl mx-auto w-full border-white/10">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* Play Button */}
        <div className="flex-shrink-0">
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-all shadow-neon"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        </div>

        {/* Track Info & Back to Live Button */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="overflow-hidden relative w-full" ref={containerRef}>
            <p ref={titleRef} className={`inline-block text-base font-bold neon-text whitespace-nowrap ${shouldAnimate ? "animate-marquee" : ""}`}>
              {trackInfo.title}
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <p className="text-xs text-muted-foreground truncate italic">{trackInfo.artist}</p>           
          </div>

          <div className="">
            {/* Ajuste: Botón de retorno debajo del artista */}
            {currentTrack && (
              <button 
                onClick={onBackToLive}
                className="mt-1 flex items-center gap-1 text-[9px] bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30 transition-all border border-primary/20 animate-in slide-in-from-left-2"
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

        {/* Volume Controls */}
        <div className={`flex items-center gap-3 ${isIPhone ? 'w-auto' : 'w-[120px] md:w-[160px]'}`}>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {isMuted || volume[0] === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          {!isIPhone && (
            <Slider 
              value={isMuted ? [0] : volume} 
              onValueChange={handleVolume} 
              max={100} 
              step={1} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;