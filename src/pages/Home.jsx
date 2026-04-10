// import TopSongss from '@/components/TopSongss'
import NewsSlider from '@/components/NewsSlider';
import { Play } from 'lucide-react';

const Home = () => {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-foreground pb-32">
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-hero-atmosphere">
        <div className="absolute inset-0 z-1 blur-[60px] opacity-90 pointer-events-none" />

        {/* Desvanecimiento suave hacia la base del fondo negro */}
        <div className="absolute inset-0 z-2 bg-linear-to-b from-transparent via-transparent to-[#0B0B0F]" />
        
        <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-7xl font-display font-black tracking-tighter neon-text leading-[1.1]">
              SALSA ROMÁNTICA <br/> 
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">24/7</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg font-medium opacity-80">
              Tu conexión directa con los clásicos que enamoran y los éxitos que dominan el mundo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button className="flex items-center gap-3 bg-primary text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(var(--primary-rgb),0.5)]">
              <Play fill="currentColor" size={18} className="-ml-1" /> 
              <span className="text-xs">Escuchar en Vivo</span> {/* Reducimos el texto aquí */}
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTENIDO: Empieza justo donde el Hero se desvanece */}
      <div className="relative z-10 mt-15">
        <section className="max-w-7xl mx-auto px-4">
          <NewsSlider />
        </section>
      </div>

    </main>
  );
};

export default Home;