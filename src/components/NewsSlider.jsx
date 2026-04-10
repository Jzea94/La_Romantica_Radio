import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsCard from './NewsCard';

const NewsSlider = () => {
  const { getLatestNews, loading } = useNews();
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getLatestNews(5);
      setLatestNews(data);
    };
    load();
  }, []);

  // Skeleton Loader para evitar el Layout Shift
  if (loading) return (
    <section className="py-8 max-w-7xl mx-auto px-4 md:px-0">
      <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-125">
        <div className="md:col-span-2 md:row-span-2 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        <div className="bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        <div className="bg-white/5 animate-pulse rounded-2xl border border-white/5" />
      </div>
    </section>
  );

  if (latestNews.length === 0) return null;

  // Lógica de Negocio: Buscamos la noticia marcada como destacada
  // Si no hay ninguna, usamos la primera del array como fallback
  const featuredIndex = latestNews.findIndex(item => item.featured === true);
  const activeFeaturedIndex = featuredIndex !== -1 ? featuredIndex : 0;

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 md:px-0">
      {/* Cabecera con jerarquía visual */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
          Lo Último en Salsa
        </h2>
        <Link 
          to="/noticias" 
          className="group text-[10px] font-black tracking-widest text-primary flex items-center gap-2 hover:brightness-125 transition-all uppercase"
        >
          Explorar todo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Contenedor Híbrido:
          Mobile: Slider horizontal con Snap
          Desktop: Bento Grid (Grid de mosaico) */}
      <div className="
        flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x snap-mandatory
        md:grid md:grid-cols-3 md:grid-rows-2 md:gap-4 md:overflow-visible md:pb-0
      ">
        {latestNews.map((item, index) => {
          const isFeaturedInDesktop = index === activeFeaturedIndex;

          return (
            <div 
              key={item.id} 
              className={`
                /* Mobile: Dimensiones fijas para el slider */
                min-w-[85%] snap-center
                /* Desktop: Reset de dimensiones y asignación de celdas */
                md:min-w-0 md:snap-align-none
                ${isFeaturedInDesktop ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}
              `}
            >
              <NewsCard 
                item={item} 
                /* Pasamos isFeatured solo si estamos en escritorio para no romper el slider móvil */
                isFeatured={isFeaturedInDesktop} 
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewsSlider;