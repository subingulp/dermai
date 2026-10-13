import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Camera, Check, Lock, ScanFace, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import PhotoFrame from '../components/ui/PhotoFrame';
import PageTransition from '../components/layout/PageTransition';
import { useApp } from '../context/AppContext';
import { ACCEPTED_TYPES, validateImageFile } from '../utils/validateImage';

export default function Capture() {
  const navigate = useNavigate();
  const { photo, setPhoto } = useApp();
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const cameraInput = useRef(null);
  const galleryInput = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setChecking(true);
    const result = await validateImageFile(file);
    setChecking(false);
    if (!result.ok) return setError(result.error);
    setPhoto({ file, url: result.url }); // also frees the previous preview
    setOpen(true);
  };

  const onPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the same file be chosen again
    handleFile(file);
  };

  const startAnalysis = () => {
    setOpen(false);
    navigate('/analyzing');
  };

  const chooseAnother = () => {
    setOpen(false);
    setTimeout(() => galleryInput.current?.click(), 80);
  };

  return (
    <PageTransition className="screen">
      <div className="scroll">
        <div className="page">
          <PageHeader title="Take a Photo" back="/app/main" />

          <div
            className={`viewfinder${dragging ? ' is-drag' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            {photo ? (
              <motion.div key={photo.url} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="viewfinder__fill">
                <PhotoFrame src={photo.url} alt="The photo you selected" className="photo--fill" />
                <span className="viewfinder__badge">
                  <Check size={13} strokeWidth={3} /> PHOTO SELECTED
                </span>
                <button type="button" className="viewfinder__remove" aria-label="Remove photo" onClick={() => setPhoto(null)}>
                  <X size={16} strokeWidth={2.4} />
                </button>
              </motion.div>
            ) : (
              <div className="viewfinder__empty">
                <span className="viewfinder__badge">
                  <Camera size={13} strokeWidth={2.4} /> CAMERA READY
                </span>
                <div className="viewfinder__guide" aria-hidden="true" />
                <p>Drop a photo here, or use the buttons below.</p>
                <span className="viewfinder__hint">Face the light. Keep your camera steady.</span>
              </div>
            )}
          </div>

          <div className="hint">
            <strong>Good light, clearer measurements.</strong>
            <p>Use a clear, unfiltered photo. DermAI finds regions automatically — no drawing needed.</p>
          </div>

          {error && (
            <div className="note note--error" role="alert">
              <AlertCircle size={16} strokeWidth={2} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          <div className="actions">
            {photo ? (
              <>
                <Button variant="primary" onClick={startAnalysis}>
                  Analyze Photo →
                </Button>
                <Button variant="secondary" onClick={() => galleryInput.current?.click()} disabled={checking}>
                  Choose Another Photo
                </Button>
                <Button variant="text" onClick={() => setPhoto(null)}>
                  Remove photo
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" onClick={() => cameraInput.current?.click()} disabled={checking}>
                  {checking ? 'Checking photo…' : 'Take Photo'}
                </Button>
                <Button variant="secondary" onClick={() => galleryInput.current?.click()} disabled={checking}>
                  Upload from Gallery
                </Button>
              </>
            )}
          </div>

          <p className="privacy">
            <Lock size={13} aria-hidden="true" /> Your photo is used for AI analysis and your dated skin record.
          </p>
        </div>
      </div>

      <input ref={cameraInput} type="file" accept={ACCEPTED_TYPES.join(',')} capture="environment" hidden onChange={onPick} />
      <input ref={galleryInput} type="file" accept={ACCEPTED_TYPES.join(',')} hidden onChange={onPick} />

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="ready-title">
        <span className="modal__icon">
          <ScanFace size={22} strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 id="ready-title" className="modal__title modal__title--lg">
          Ready for a little clarity?
        </h2>
        <p className="modal__text">DermAI will automatically analyze this photo and save your measurements by date.</p>
        <Button variant="primary" onClick={startAnalysis}>
          Analyze Photo →
        </Button>
        <Button variant="secondary" onClick={chooseAnother}>
          Choose Another Photo
        </Button>
        <small className="modal__fine">Demo build: results are simulated.</small>
      </Modal>
    </PageTransition>
  );
}
