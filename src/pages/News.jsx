// src/pages/NewsPage.jsx (Versión de Prueba Paso 2)
import { useEffect, useState } from 'react';
import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/NewsCard';

const NewsPage = () => {
  const { getAllNews, loading, error } = useNews();
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const runTest = async () => {
      const data = await getAllNews();
      setTestData(data);
    };
    runTest();
  }, []);

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold neon-text mb-2">Noticias</h1>
        <p className="text-slate-400">Validación visual de NewsCard + Supabase Storage</p>
      </header>

      {/* Grid de prueba */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testData.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Feedback de estados */}
      {loading && (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center text-red-200">
          <p>Ocurrió un error al cargar las noticias: {error}</p>
        </div>
      )}

      {!loading && testData.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No hay noticias registradas en la base de datos.
        </div>
      )}
    </div>
  );
};

export default NewsPage;