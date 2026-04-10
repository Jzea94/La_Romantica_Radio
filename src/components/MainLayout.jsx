import { useState, useRef, useLayoutEffect } from "react";
import { Outlet } from 'react-router-dom';
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import TopNav from './TopNav';
import Footer from './Footer';
import AudioPlayer from './audioController/AudioPlayer';
import BottomNav from './BottomNav';

const MainLayout = () => {
  const { currentTrack, handleSelectTrack, handleBackToLive, handleNext, handlePrevious } = useMusicPlayer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  // Altura fija para el mini player para evitar cálculos en el render
  const MINI_PLAYER_HEIGHT = 72; 

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F] overflow-x-hidden">
      <TopNav />
      
      {/* Espaciador estático: no se mueve, no se anima */}
      <main className="grow" style={{ paddingBottom: `${navHeight + MINI_PLAYER_HEIGHT}px` }}>
        <Outlet context={{ handleSelectTrack, activeTrackId: currentTrack?.id }} />
      </main>
      
      <Footer />

      {/* Contenedor del Player:
          - Posición SIEMPRE fija en la misma ubicación (bottom)
          - No cambiamos de 'bottom' dinámico a 'top-0 bottom-0'
          - El AudioPlayer controla su propio z-index y opacity
          - Esto evita cualquier salto o recálculo de posición
      */}
      <div 
        className="fixed left-0 right-0 px-2 z-50 pointer-events-auto"
        style={{ bottom: `${navHeight}px` }}
      >
        <AudioPlayer 
          streamUrl="https://stream.zeno.fm/qhefwzwt8qetv"
          currentTrack={currentTrack}
          onBackToLive={handleBackToLive}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      
      <BottomNav ref={navRef} />
    </div>
  );
};

export default MainLayout;