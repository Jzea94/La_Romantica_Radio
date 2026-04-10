import { useOutletContext } from "react-router-dom";
import { useTopSongs } from "../hooks/useTopSongs";
import { MoreHorizontal, CheckCircle2 } from "lucide-react";

const MusicStore = () => {
  const { songs, loading, error } = useTopSongs();
  
  const { 
    handleSelectTrack, 
    activeTrackId, 
    isPlaying 
  } = useOutletContext();

  if (loading) return (
    <div className="flex justify-center p-20 bg-[#0B0B0F]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
    </div>
  );

  if (error) return <div className="w-full p-10 text-center text-destructive bg-[#0B0B0F]">Error: {error}</div>;

  return (
    <div className="w-full bg-[#0B0B0F] pb-20">
      <div className="flex flex-col gap-1">
        {songs.map((song, index) => {
          const isActive = song.id === activeTrackId;
          
          return (
            <div
              key={song.id}
              onClick={() => handleSelectTrack(song)}
              className={`
                group flex items-center gap-4 p-1.5 rounded-md cursor-pointer transition-all duration-200
              `}
            >
              {/* Cover Art */}
              <div className="w-12 h-12 rounded shadow-lg overflow-hidden shrink-0 border border-white/5">
                <img 
                  src={song.path_cover} 
                  alt={song.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Info de la Canción */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-white'}`}>
                  {song.title}
                </h3>
                <p className="text-[12px] text-white/50 truncate group-hover:text-white/80 transition-colors">
                  {song.artist}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicStore;