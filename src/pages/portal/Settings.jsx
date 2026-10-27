import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { studentLinks } from '../../data/portalNavigation';

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-4)', padding: 'var(--space-4) 0',
        borderBottom: '1px solid var(--gray-100)',
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{label}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{hint}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          width: 48, height: 26, borderRadius: 999, flexShrink: 0,
          background: checked ? 'var(--color-primary)' : 'var(--gray-300)',
          position: 'relative', transition: 'background var(--transition-fast)',
        }}
      >
        <span
          style={{
            position: 'absolute', top: 3, left: checked ? 25 : 3,
            width: 20, height: 20, borderRadius: '50%', background: '#fff',
            transition: 'left var(--transition-fast)', boxShadow: 'var(--shadow-sm)',
          }}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    emailUpdates: true,
    newInternships: true,
    weeklyDigest: false,
    publicProfile: false,
  });
  const [dangerOpen, setDangerOpen] = useState(false);

  const set = (key) => (value) => setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <PortalLayout title="Settings" links={studentLinks}>
      <div className="panel">
        <div className="panel__header">
          <h3 className="panel__title">Notifications</h3>
        </div>
        <div className="panel__body">
          <Toggle
            label="Application status updates"
            hint="Email me when my application moves to the next stage."
            checked={prefs.emailUpdates}
            onChange={set('emailUpdates')}
          />
          <Toggle
            label="New internship alerts"
            hint="Notify me when roles matching my skills open up."
            checked={prefs.newInternships}
            onChange={set('newInternships')}
          />
          <Toggle
            label="Weekly learning digest"
            hint="A Monday email with recommended content for my track."
            checked={prefs.weeklyDigest}
            onChange={set('weeklyDigest')}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h3 className="panel__title">Privacy</h3>
        </div>
        <div className="panel__body">
          <Toggle
            label="Public learner profile"
            hint="Let employers in the partner network discover my profile."
            checked={prefs.publicProfile}
            onChange={set('publicProfile')}
          />
          <div style={{ paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
            Certificate verification is always public — anyone with your certificate code can
            confirm it is authentic. Codes never reveal other personal data.
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h3 className="panel__title" style={{ color: 'var(--color-danger)' }}>Danger Zone</h3>
        </div>
        <div className="panel__body">
          {!dangerOpen ? (
            <Button variant="danger" onClick={() => setDangerOpen(true)}>
              Sign out of this device
            </Button>
          ) : (
            <div className="alert alert--warning" style={{ marginBottom: 0 }}>
              ⚠️ You'll need your credentials to return to the portal.
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                >
                  Yes, sign out
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDangerOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
