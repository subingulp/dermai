import SubPage from './SubPage';
import Badge from '../../components/ui/Badge';
import Toggle from '../../components/ui/Toggle';
import { useApp } from '../../context/AppContext';
import { IS_MOCK } from '../../services/api';

export default function Settings() {
  const { settings, updateSettings } = useApp();
  return (
    <SubPage title="AI Analysis Settings">
      <div className="panel">
        <div className="statusrow">
          <div>
            <p className="toggle-row__label">Analysis engine</p>
            <p className="toggle-row__desc">Photos are analysed by a built-in simulator. No model or server is connected yet.</p>
          </div>
          <Badge tone={IS_MOCK ? 'cream' : 'pale'}>{IS_MOCK ? 'DEMO' : 'LIVE'}</Badge>
        </div>

        <Toggle
          label="Reduce animations"
          description="Turns off sliding and counting effects. Also follows your device's reduced-motion setting."
          checked={settings.reduceMotion}
          onChange={(v) => updateSettings({ reduceMotion: v })}
        />
        <Toggle label="Analysis reminders" description="Coming soon." checked={false} disabled onChange={() => {}} />
        <Toggle label="Keep photo history after closing" description="Coming soon. Today, photos only last for this visit." checked={false} disabled onChange={() => {}} />
      </div>
    </SubPage>
  );
}
