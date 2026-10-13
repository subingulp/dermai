import { useState } from 'react';
import SubPage from './SubPage';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

export default function Privacy() {
  const { resetAll } = useApp();
  const [open, setOpen] = useState(false);

  const wipe = () => {
    resetAll();
    // A full reload also clears the in-memory demo records.
    window.location.assign('/');
  };

  return (
    <SubPage title="Privacy & Data">
      <div className="panel prose">
        <h2 className="panel__title">What happens to your photos</h2>
        <p>In this prototype, photos you choose stay in your browser tab. They are not uploaded, and they disappear when you close or reload the page.</p>
        <p>When the real analysis service is added, this page will explain exactly what is sent, how long it is kept and how to delete it.</p>
        <p>DermAI describes patterns in photos. It does not diagnose any condition.</p>
      </div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete all local data
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="wipe-title">
        <h2 id="wipe-title" className="modal__title">
          Delete everything on this device?
        </h2>
        <p className="modal__text">This clears your guest profile, settings, routine entries and photos from this browser, then returns to the welcome screen.</p>
        <Button variant="primary" onClick={wipe}>
          Delete all local data
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Keep my data
        </Button>
      </Modal>
    </SubPage>
  );
}
