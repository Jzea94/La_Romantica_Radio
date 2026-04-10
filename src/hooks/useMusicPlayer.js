import { useState, useCallback } from "react";

export const useMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);

  const handleSelectTrack = useCallback((track, currentPlaylist = []) => {
    setCurrentTrack(track);
    if (currentPlaylist.length > 0) setPlaylist(currentPlaylist);
  }, []);

  const handleBackToLive = useCallback(() => {
    setCurrentTrack(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
  }, [currentTrack, playlist]);

  const handlePrevious = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
  }, [currentTrack, playlist]);

  return {
    currentTrack,
    handleSelectTrack,
    handleBackToLive,
    handleNext,
    handlePrevious,
    isLive: !currentTrack
  };
};