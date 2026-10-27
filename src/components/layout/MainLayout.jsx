import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';

export default function MainLayout({ children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
