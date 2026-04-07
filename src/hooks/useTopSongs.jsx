import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useTopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener datos de la tabla
        const { data, error: dbError } = await supabase
          .from('top_songs')
          .select('*');
        
        if (dbError) throw dbError;

        // 2. Mapear y obtener URLs del storage
        const songsWithUrls = data.map((song) => {
          const { data: urlData } = supabase.storage
            .from('songs')
            .getPublicUrl(song.file_path);

          return {
            ...song,
            audioUrl: urlData.publicUrl
          };
        });
        setSongs(songsWithUrls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return { songs, loading, error };
};