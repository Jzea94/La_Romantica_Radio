import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const NewsCard = ({ item }) => {
  const date = new Date(item.created_at).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link 
      to={`/noticias/${item.id}`}
      className="group relative block w-full aspect-16/10 rounded-2xl overflow-hidden border border-white/10 bg-black transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Imagen de fondo con Filtros de Legibilidad */}
      <div className="absolute inset-0">
        <img 
          src={item.image_url || 'https://placehold.co/600x400?text=Salsa+Romántica'} 
          alt={item.title}
          // Brightness-[0.5] es clave: oscurece logos y textos brillantes del fondo
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-[0.5] contrast-[1.1]"
        />
        
        {/* Scrim (Capa de protección de texto) de tres niveles */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Contenido de la Card */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          {/* Badge con más contraste */}
          <span className="px-2 py-1 rounded-md bg-primary text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
            {item.category || 'General'}
          </span>
          <div className="flex items-center gap-1 text-white/90 text-[10px] font-medium drop-shadow-sm">
            <Calendar size={12} className="text-primary" />
            {date}
          </div>
        </div>

        {/* Título con sombra proyectada para separar del fondo ruidoso */}
        <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {item.title}
        </h3>

        <p className="text-xs text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm">
          {item.excerpt}
        </p>
        
        <div className="mt-3 flex items-center text-primary text-[10px] font-black uppercase gap-1 group-hover:gap-2 transition-all drop-shadow-md">
          Leer más <ChevronRight size={14} strokeWidth={3} />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;