import TopSongs from '@/components/TopSongs'

const Home = () => {
  return (
    <div className="space-y-12 pb-24">
      {/* SECCIÓN HERO: El impacto visual principal */}
      <section className="relative pt-12 md:pt-20">
        <div className="container mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-bold neon-text leading-tight">
            Salsa Romántica FM
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Tu estación preferida 24/7. Los clásicos que enamoran y las nuevas promesas del género en un solo lugar.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE CONTENIDO: Aquí iría tu Top de canciones o noticias */}
      <section className="container mx-auto scroll-mt-20 px-4">
        <div className="glass rounded-3xl py-8 px-5 shadow-xl max-w-4xl mx-auto w-full mt-8 border border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Top Canciones de la Semana
          </h2>
      </div>
        <TopSongs />
      </section>
    </div>
  );
};

export default Home;