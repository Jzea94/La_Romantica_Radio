import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Footer from './Footer';
import AudioPlayer from './AudioPlayer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      
      {/* El contenido de las páginas se renderiza aquí */}
      <main className="grow">
        <Outlet />
      </main>

      <Footer />

      <div className="fixed bottom-0 left-0 w-full z-50">
        <AudioPlayer streamUrl={"https://stream.zeno.fm/qhefwzwt8qetv"}/>
      </div>
    </div>
  );
};

export default MainLayout;