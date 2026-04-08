import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper para construir la URL pública de la imagen
  const getPublicUrl = (path) => {
    if (!path) return null;
    // Si la URL ya es completa (empieza con http), la devolvemos tal cual
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
      .from('news_images') // Nombre exacto de tu bucket
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const getLatestNews = async (limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (supabaseError) throw supabaseError;
      
      // MAPEAMOS LA DATA PARA INCLUIR LA URL PÚBLICA
      const mappedData = data.map(item => ({
        ...item,
        image_url: getPublicUrl(item.image_url)
      }));

      setNews(mappedData);
      return mappedData;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAllNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      
      // MAPEAMOS LA DATA PARA INCLUIR LA URL PÚBLICA
      const mappedData = data.map(item => ({
        ...item,
        image_url: getPublicUrl(item.image_url)
      }));

      setNews(mappedData);
      return mappedData;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getNewsById = async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      
      return {
        ...data,
        image_url: getPublicUrl(data.image_url)
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, getLatestNews, getNewsById, getAllNews };
};