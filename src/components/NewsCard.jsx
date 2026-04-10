import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * NewsCard: Componente de tarjeta de noticias con soporte para diseño destacado.
 * En móvil siempre mantiene proporción 16/10. En PC se adapta al grid.
 */
const NewsCard = ({ item, isFeatured }) => {
  const date = new Date(item.created_at).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link 
      to={`/noticias/${item.id}`}
      className={`
        group relative block w-full rounded-2xl overflow-hidden border border-white/10 bg-black transition-all duration-300 hover:scale-[1.01]
        aspect-16/10 ${isFeatured ? 'md:aspect-auto md:h-full md:min-h-100' : ''}
      `}
    >
      {/* Capa de Imagen con filtros de legibilidad */}
      <div className="absolute inset-0">
        <img 
          src={item.image_url || 'https://placehold.co/600x400?text=La+Romántica'} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.45] contrast-[1.1]"
        />
        {/* Scrim (Capa de degradado profundo para texto blanco) */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Contenido */}
      <div className={`
        absolute inset-0 flex flex-col justify-end transition-all duration-300
        ${isFeatured ? 'p-5 md:p-10' : 'p-5'}
      `}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 rounded-md bg-primary text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
            {item.category || 'General'}
          </span>
          <div className="flex items-center gap-1 text-white/90 text-[10px] font-medium drop-shadow-sm">
            <Calendar size={12} className="text-primary" />
            {date}
          </div>
        </div>

        {/* Título: Escala en desktop si es destacada */}
        <h3 className={`
          font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
          ${isFeatured ? 'text-lg md:text-3xl lg:text-4xl' : 'text-lg'}
        `}>
          {item.title}
        </h3>

        {/* Resumen: Visible siempre en destacada (PC), solo en hover en las demás */}
        <p className={`
          text-white/80 line-clamp-2 drop-shadow-sm transition-opacity duration-300
          ${isFeatured ? 'text-xs md:text-base md:opacity-100 mb-4' : 'text-xs opacity-0 group-hover:opacity-100'}
        `}>
          {item.excerpt}
        </p>
        
        <div className="mt-2 flex items-center text-primary text-[10px] font-black uppercase gap-1 group-hover:gap-2 transition-all drop-shadow-md">
          Leer más <ChevronRight size={14} strokeWidth={3} />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;