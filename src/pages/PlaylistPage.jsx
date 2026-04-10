import { Search, ListMusic } from "lucide-react";
import MusicStore from "@/components/TrackList";

const Music = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* 1. BARRA DE BÚSQUEDA */}
      <div className="sticky top-0 z-20 bg-[#0B0B0F]/80 backdrop-blur-md p-4">
        <div className="max-w-5xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar en esta página"
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-2 pt-8">
        {/* CABECERA: Playlist Info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
          
          {/* 2. IMAGEN DE LA PLAYLIST */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <img 
              src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop" 
              alt="Playlist Cover" 
              className="relative w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">Playlist</span>
            
            {/* 3. TÍTULO */}
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">
              Salsa Romántica
            </h1>

            {/* 4. PÁRRAFO DE DESCRIPCIÓN */}
            <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed">
              Esta playlist es dedicada a esos corazones románticos que se entregan con pasión desmedida. 
              Para ellos este susurro de amor, ritmo y sentimiento.
            </p>
            
            <div className="flex items-center gap-4 mt-6 text-sm font-bold text-white/40">
              <span className="flex items-center gap-2">
                <ListMusic size={16} className="text-primary" />
                La Romántica Radio
              </span>
              <span>•</span>
              <span>20 canciones</span>
            </div>
          </div>
        </div>

        {/* 5. ESPACIO PARA RENDERIZAR MUSIC STORE */}
        <div className="w-full border-t border-white/5 pt-8">
          <MusicStore />
        </div>
      </div>
    </div>
  );
};

export default Music;