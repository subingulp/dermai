import SubPage from './SubPage';
import Disclaimer from '../../components/ui/Disclaimer';

const STEPS = ['Skin Photo', 'Automatic Region Detection', 'ROI Crop', 'Few-shot Learning Model', 'AI Risk Assessment'];

export default function About() {
  return (
    <SubPage title="About DermAI">
      <div className="panel prose">
        <h2 className="panel__title">A little clarity, by design.</h2>
        <p>DermAI is a university Capstone prototype for skin analysis and longitudinal tracking: take one photo, get measurements, and watch them change over time.</p>
        <h3>Planned pipeline</h3>
        <ol className="pipeline">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="fine">This build · v1.0 · front end with demo data. The Python backend and AI models are not connected.</p>
      </div>
      <Disclaimer>Observation over time. Never a medical diagnosis.</Disclaimer>
    </SubPage>
  );
}
