import { useOutletContext } from "react-router-dom";
import { useTopSongs } from "../hooks/useTopSongs";
import { Play, Pause, Music } from "lucide-react";

const TopSongs = () => {
  const { songs, loading, error } = useTopSongs();
  
  // Extraemos las funciones y el estado desde el MainLayout
  const { handleSelectTrack, activeTrackId } = useOutletContext();

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto w-full p-10 text-center text-destructive">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full py-4 px-2 space-y-3">
      {songs.map((song, index) => {
        // Definimos isActive para cada iteración
        const isActive = song.id === activeTrackId;

        return (
          <div 
            key={song.id}
            onClick={() => handleSelectTrack(song)}
            className={`top-song-row group transition-all ${isActive ? 'active' : ''} ${index === 0 ? 'top-first-song-row' : ''}`}
          >

            {/* 1. RANKING */}
            <div className="rank-badge">
              {index + 1}
            </div>

            {/* 2. PORTADA (Thumbnail) */}
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden">
              {song.album_art ? (
                <img src={song.album_art} alt={song.title} className="w-full h-full object-cover" />
              ) : (
                <Music size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>

            {/* 3. INFO DE CANCIÓN */}
            <div className="flex-1 min-w-0 px-2">
              <h3 className="text-sm font-bold text-foreground truncate">
                {song.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate uppercase tracking-tighter">
                {song.artist}
              </p>
            </div>

            {/* 4. WAVEFORM (Solo si está activa) */}
            {isActive && (
              <div className="waveform-container px-3 hidden md:flex">
                <div className="waveform-bar h-2" style={{ animationDelay: '0s' }}></div>
                <div className="waveform-bar h-4" style={{ animationDelay: '0.2s' }}></div>
                <div className="waveform-bar h-3" style={{ animationDelay: '0.4s' }}></div>
                <div className="waveform-bar h-5" style={{ animationDelay: '0.1s' }}></div>
                <div className="waveform-bar h-2" style={{ animationDelay: '0.3s' }}></div>
              </div>
            )}

            {/* 5. BOTÓN PLAY/PAUSE INDICATOR */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary border border-primary/30 group-hover:bg-primary/10'
            }`}>
              {isActive ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="none" className="ml-0.5" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopSongs;