import { useState } from 'react';
import { DeviceContext } from './DeviceContext';

/** Centers the app in a phone-sized frame on desktop; fills the screen on phones. */
export default function AppShell({ children }) {
  const [root, setRoot] = useState(null);
  return (
    <div className="stage">
      <aside className="stage__aside" aria-hidden="true">
        <p className="stage__brand">DermAI ✦</p>
        <p>Capstone prototype · front end only</p>
        <p>All photos, measurements and risk wording are demonstration data. Nothing is sent anywhere.</p>
      </aside>
      <div className="device" ref={setRoot}>
        <DeviceContext.Provider value={root}>{children}</DeviceContext.Provider>
      </div>
    </div>
  );
}
