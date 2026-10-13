import { AnimatePresence, MotionConfig } from 'motion/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import TabLayout from './components/layout/TabLayout';
import { useApp } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import About from './pages/me/About';
import Privacy from './pages/me/Privacy';
import Profile from './pages/me/Profile';
import Routine from './pages/me/Routine';
import Settings from './pages/me/Settings';
import Analyzing from './pages/Analyzing';
import Capture from './pages/Capture';
import Data from './pages/Data';
import Main from './pages/Main';
import Me from './pages/Me';
import Results from './pages/Results';
import Risk from './pages/Risk';
import Tutorial from './pages/Tutorial';
import Welcome from './pages/Welcome';

/** Pages after the welcome screen need a guest session; otherwise go back to Welcome. */
function RequireGuest({ children }) {
  const { guest } = useApp();
  return guest ? children : <Navigate to="/" replace />;
}

export default function App() {
  const location = useLocation();
  const { settings } = useApp();
  // The three tabs share a layout, so they count as one "page" for the big transitions.
  const key = location.pathname.startsWith('/app') ? '/app' : location.pathname;

  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? 'always' : 'user'}>
      <AppShell>
        <DataProvider>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={key}>
              <Route path="/" element={<Welcome />} />
              <Route path="/tutorial" element={<Tutorial />} />

              <Route
                path="/app"
                element={
                  <RequireGuest>
                    <TabLayout />
                  </RequireGuest>
                }
              >
                <Route index element={<Navigate to="main" replace />} />
                <Route path="main" element={<Main />} />
                <Route path="data" element={<Data />} />
                <Route path="me" element={<Me />} />
              </Route>

              <Route path="/capture" element={<RequireGuest><Capture /></RequireGuest>} />
              <Route path="/analyzing" element={<RequireGuest><Analyzing /></RequireGuest>} />
              <Route path="/results/:id" element={<RequireGuest><Results /></RequireGuest>} />
              <Route path="/history/:id" element={<RequireGuest><Results /></RequireGuest>} />
              <Route path="/risk/:id" element={<RequireGuest><Risk /></RequireGuest>} />

              <Route path="/me/profile" element={<RequireGuest><Profile /></RequireGuest>} />
              <Route path="/me/routine" element={<RequireGuest><Routine /></RequireGuest>} />
              <Route path="/me/settings" element={<RequireGuest><Settings /></RequireGuest>} />
              <Route path="/me/privacy" element={<RequireGuest><Privacy /></RequireGuest>} />
              <Route path="/me/about" element={<RequireGuest><About /></RequireGuest>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </DataProvider>
      </AppShell>
    </MotionConfig>
  );
}
