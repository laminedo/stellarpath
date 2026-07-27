import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { Starfield } from './components/three/Starfield';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { PageTransition, DisclaimerFooter } from './components/layout/PageTransition';
import { Dashboard } from './components/pages/Dashboard';
import { NumerologyPage } from './components/pages/NumerologyPage';
import { AstrologyPage } from './components/pages/AstrologyPage';
import { CalendarPage } from './components/pages/CalendarPage';
import { CompatibilityPage } from './components/pages/CompatibilityPage';
import { ProfilePage } from './components/pages/ProfilePage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
      <Route path="/numerology" element={<PageTransition><NumerologyPage /></PageTransition>} />
      <Route path="/astrology" element={<PageTransition><AstrologyPage /></PageTransition>} />
      <Route path="/calendar" element={<PageTransition><CalendarPage /></PageTransition>} />
      <Route path="/compatibility" element={<PageTransition><CompatibilityPage /></PageTransition>} />
      <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <HashRouter>
        <div className="min-h-screen font-sans text-white">
          <Starfield />
          <Navbar />
          <AnimatedRoutes />
          <DisclaimerFooter />
          <BottomNav />
        </div>
      </HashRouter>
    </ProfileProvider>
  );
}
