import SubPage from './SubPage';
import Button from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

const SKIN_TYPES = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive', 'Not sure'];
const CONCERNS = ['Redness', 'Breakouts', 'Dryness', 'Oiliness', 'Dark spots', 'Sensitivity'];

export default function Profile() {
  const { profile, updateProfile } = useApp();
  const toggleConcern = (c) =>
    updateProfile({ concerns: profile.concerns.includes(c) ? profile.concerns.filter((x) => x !== c) : [...profile.concerns, c] });

  return (
    <SubPage title="My Skin Profile">
      <div className="panel">
        <label className="field">
          <span>Display name</span>
          <input
            type="text"
            value={profile.name}
            maxLength={24}
            placeholder="Guest User"
            onChange={(e) => updateProfile({ name: e.target.value })}
          />
        </label>

        <fieldset className="field">
          <legend>Skin type</legend>
          <div className="chips">
            {SKIN_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip${profile.skinType === t ? ' is-on' : ''}`}
                aria-pressed={profile.skinType === t}
                onClick={() => updateProfile({ skinType: profile.skinType === t ? '' : t })}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>What would you like to keep an eye on?</legend>
          <div className="chips">
            {CONCERNS.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${profile.concerns.includes(c) ? ' is-on' : ''}`}
                aria-pressed={profile.concerns.includes(c)}
                onClick={() => toggleConcern(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="fine">Saved on this device only. DermAI doesn't use this to change any measurement.</p>
      </div>

      <Button variant="secondary" disabled>
        Create an account · coming soon
      </Button>
    </SubPage>
  );
}
