import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";

const AudioPlayer = ({ streamUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [trackInfo, setTrackInfo] = useState({
    title: "Salsa Romántica FM",
    artist: "En Vivo 24/7"
  });
  
  const audioRef = useRef(null);
  const streamId = streamUrl.split('/').pop();

  // Lógica de Metadatos mediante Server-Sent Events (SSE)
  useEffect(() => {
    // Usamos el endpoint /subscribe/ según la documentación de Zeno
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

    eventSource.onerror = () => {
      console.warn("Conexión SSE perdida. Reintentando...");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [streamId]);

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
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolume = (newVal) => {
    setVolume(newVal);
    const muted = newVal[0] === 0;
    setIsMuted(muted);
    if (audioRef.current) audioRef.current.volume = muted ? 0 : newVal[0] / 100;
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume[0] / 100;
    }
  };

  return (
    <div className="glass border border-white/10 p-4 rounded-2xl flex items-center justify-between max-w-4xl mx-auto shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,46,126,0.4)]"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isPlaying && (
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
            <p className="text-sm font-bold neon-text truncate">
              {trackInfo.title}
            </p>
          </div>
          <p className="text-xs text-muted-foreground truncate italic">
            {trackInfo.artist}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-32 md:w-48 ml-4">
        <button 
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted || volume[0] === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <Slider 
          value={isMuted ? [0] : volume} 
          onValueChange={handleVolume} 
          max={100} 
          step={1} 
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;