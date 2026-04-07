import { useState, useRef, useEffect } from "react";

export const useAudioEngine = (streamUrl, currentTrack) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const audioRef = useRef(null);

  const isIPhone = typeof window !== 'undefined' && /iPhone/.test(navigator.userAgent);

  // Inicialización y Cambio de Fuente
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.preload = "auto";
    }
    
    const audio = audioRef.current;

    const loadSource = async () => {
      audio.pause();
      // Si hay track de Supabase usamos su URL, si no, la del stream
      audio.src = currentTrack ? currentTrack.audioUrl : (isPlaying ? streamUrl : "");
      
      if (currentTrack || isPlaying) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay bloqueado:", err);
          setIsPlaying(false);
        }
      }
    };

    loadSource();
  }, [currentTrack, streamUrl]);

  // Sincronización de Volumen y Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isIPhone) {
        audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
      }
    }
  }, [isMuted, volume, isIPhone]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      if (!currentTrack) audioRef.current.src = ""; 
      setIsPlaying(false);
    } else {
      if (!currentTrack) audioRef.current.src = streamUrl;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (v) => {
    setVolume(v);
    if (v[0] === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  return {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    volume,
    handleVolumeChange,
    togglePlay,
    isIPhone
  };
};