import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatPopup from './ChatPopup';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatPopup />
    </div>
  );
};

export default RootLayout; 