import React from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

const PlayerControls = ({ 
  isPlaying, 
  isLive, 
  isMuted, 
  setIsMuted, 
  onPlayPause, 
  onNext, 
  onPrevious 
}) => {
  return (
    <div className="shrink-0 pt-6 w-full">
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="p-3 text-white/40 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={26} /> : <Volume2 size={26} />}
        </button>
        
        <div className="flex items-center gap-8">
          {!isLive && (
            <button onClick={onPrevious} className="text-white/80 hover:text-primary active:scale-90 transition-all">
              <SkipBack size={32} fill="currentColor" />
            </button>
          )}
          <button 
            onClick={onPlayPause}
            className="w-20 h-20 rounded-full bg-primary text-black flex items-center justify-center shadow-neon hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={38} fill="currentColor" /> : <Play size={38} fill="currentColor" className="ml-1" />}
          </button>
          {!isLive && (
            <button onClick={onNext} className="text-white/80 hover:text-primary active:scale-90 transition-all">
              <SkipForward size={32} fill="currentColor" />
            </button>
          )}
        </div>

        <div className="w-12" /> {/* Balanceador de layout */}
      </div>
    </div>
  );
};

export default PlayerControls;