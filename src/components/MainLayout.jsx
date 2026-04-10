import { useState, useRef, useLayoutEffect } from "react";
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Footer from './Footer';
import AudioPlayer from './AudioPlayerr';
import BottomNav from './BottomNav';

const MainLayout = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  // Funciones de navegación que serán inyectadas por el MusicStore
  const [navigation, setNavigation] = useState({ next: null, prev: null });

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleSelectTrack = (track) => {
    setCurrentTrack(track);
  };

  const handleBackToLive = () => {
    setCurrentTrack(null);
    setNavigation({ next: null, prev: null }); // Limpiamos navegación al volver al live
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="grow">
        <Outlet context={{ 
          handleSelectTrack, 
          activeTrackId: currentTrack?.id,
          setIsExpanded,
          setNavigation // Permitimos que MusicStore pase sus funciones de Next/Prev
        }} />
      </main>
      <Footer />

      <div 
        className={`fixed left-0 right-0 transition-all duration-500 ease-in-out px-2
          ${isExpanded ? "inset-0 p-0 z-100" : "z-50"}`}
        style={!isExpanded ? { bottom: `calc(${navHeight}px)`} : {}}
      >
        <AudioPlayer 
          streamUrl="https://stream.zeno.fm/qhefwzwt8qetv"
          currentTrack={currentTrack}
          onBackToLive={handleBackToLive}
          onNext={navigation.next} // Pasamos la función al reproductor
          onPrevious={navigation.prev} // Pasamos la función al reproductor
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <BottomNav ref={navRef} />
    </div>
  );
};

export default MainLayout;