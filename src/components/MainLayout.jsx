import { useState, useCallback } from "react";
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Footer from './Footer';
import AudioPlayer from './AudioPlayer';
import BottomNav from './BottomNav'

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleNavigate = useCallback((section) => {
    setActiveSection(section);
    if (section !== "inicio") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleSelectTrack = (track) => {
    setCurrentTrack(track);
  };

  const handleBackToLive = () => {
    setCurrentTrack(null);
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopNav />
      
      {/* El contenido de las páginas se renderiza aquí */}
      <main className="grow">
        <Outlet context={{ handleSelectTrack, activeTrackId: currentTrack?.id }} />
      </main>

      <Footer />

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-2">
        <AudioPlayer 
          streamUrl="https://stream.zeno.fm/qhefwzwt8qetv"
          currentTrack={currentTrack}
          onBackToLive={handleBackToLive}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default MainLayout;