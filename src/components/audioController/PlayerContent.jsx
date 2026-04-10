import React from "react";
import { motion } from "framer-motion";
import MarqueeText from "./MarqueeText";

const PlayerContent = ({ info, isLive }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 min-h-0 w-full">
      {/* Contenedor del artwork con layoutId para evitar saltos de la imagen */}
      <motion.div 
        layoutId="player-artwork-container"
        className="w-full aspect-square max-w-87.5 rounded-3xl shadow-2xl overflow-hidden border border-white/5 shrink-0"
      >
        <img 
          src={info.cover} 
          className="w-full h-full object-cover" 
          alt="cover" 
        />
      </motion.div>

      <div className="w-full text-center space-y-2 px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            {isLive ? "En Directo" : "Reproduciendo"}
          </span>
        </div>
        <MarqueeText text={info.title} className="text-2xl font-black text-white tracking-tight" />
        <p className="text-lg text-white/50 font-medium tracking-wide">
          {info.artist}
        </p>
      </div>
    </div>
  );
};

export default PlayerContent;