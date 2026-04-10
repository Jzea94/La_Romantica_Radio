import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import MainLayout from '@/components/MainLayout';
import Home from '@/pages/Home';
import NewsPage from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import PlaylistPage from '@/pages/PlaylistPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>       
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />          
            <Route path="noticias" element={<NewsPage />} />
            <Route path="noticias/:id" element={<NewsDetail />} />          
            <Route path="musica" element={<PlaylistPage />} />
            {/* <Route path="*" element={<div>Página no encontrada</div>} /> */}          
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;