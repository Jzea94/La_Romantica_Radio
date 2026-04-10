import { useOutletContext } from "react-router-dom";
import { useTopSongs } from "../hooks/useTopSongs";

/**
 * Componente auxiliar para mejorar la experiencia visual durante la carga.
 * Abstraer esto permite que el componente principal sea más legible.
 */
const MusicSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-2">
        <div className="w-12 h-12 bg-white/5 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded w-1/3" />
          <div className="h-2 bg-white/5 rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

const MusicStore = () => {
  const { songs, loading, error } = useTopSongs();
  
  // Extraemos las funciones del contexto del MainLayout
  const { handleSelectTrack, activeTrackId } = useOutletContext();

  if (loading) return <MusicSkeleton />;

  if (error) {
    return (
      <div className="w-full p-10 text-center text-destructive bg-[#0B0B0F]">
        <p className="text-sm font-medium">Error al cargar la música</p>
        <p className="text-xs opacity-50">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0B0B0F] pb-20">
      <div className="flex flex-col gap-1">
        {songs.map((song) => {
          const isActive = song.id === activeTrackId;
          
          return (
            <div
              key={song.id}
              /**
               * Pasamos 'song' (la pista actual) y 'songs' (la lista completa).
               * Esto permite que el reproductor gestione la navegación (next/prev) 
               * basándose en el orden real de esta lista.
               */
              onClick={() => handleSelectTrack(song, songs)}
              className={`
                group flex items-center gap-4 p-1.5 rounded-md cursor-pointer transition-all duration-200
                ${isActive ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-white/5 border-l-2 border-transparent'}
              `}
            >
              {/* Cover Art */}
              <div className="w-12 h-12 rounded shadow-lg overflow-hidden shrink-0 border border-white/5">
                <img 
                  src={song.path_cover} 
                  alt={song.title} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
                />
              </div>

              {/* Info de la Canción */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-primary' : 'text-white'}`}>
                  {song.title}
                </h3>
                <p className="text-[12px] text-white/50 truncate group-hover:text-white/80 transition-colors">
                  {song.artist}
                </p>
              </div>

              {/* Indicador visual de actividad */}
              {isActive && (
                <div className="pr-4">
                  <div className="flex gap-0.5 h-3 items-end">
                    <span className="w-0.5 h-full bg-primary animate-bounce" />
                    <span className="w-0.5 h-2/3 bg-primary animate-[bounce_1.2s_infinite]" />
                    <span className="w-0.5 h-full bg-primary animate-[bounce_0.8s_infinite]" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicStore;