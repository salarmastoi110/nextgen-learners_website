import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

/**
 * /ambassador — program entry point for signed-in users who are not yet
 * ambassadors: shows application status or the application form.
 */
export default function AmbassadorHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(undefined); // undefined = loading, null = none
  const [form, setForm] = useState({ university: '', program: '', year: '', city: '', motivation: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    ambassadorService.getApplication(user.email).then(setApplication).catch(() => setApplication(null));
  }, [user.email]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.university || !form.program || !form.year || !form.motivation) {
      setError('Please fill in all required fields.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const record = await ambassadorService.apply({ ...form, name: user.name, email: user.email });
      setApplication(record);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const field = (name, label, placeholder, textarea = false) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`amb-${name}`}>{label}</label>
      {textarea ? (
        <textarea id={`amb-${name}`} className="form-textarea" rows={4} placeholder={placeholder}
          value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      ) : (
        <input id={`amb-${name}`} className="form-input" placeholder={placeholder}
          value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      )}
    </div>
  );

  return (
    <PortalLayout
      title="Campus Ambassador Program"
      links={ambassadorLinks.filter((l) => l.path.startsWith('/portal/'))}
      brandLabel="Ambassador Portal"
    >
      <div className="panel" style={{ maxWidth: 680 }}>
        <div className="panel__header">
          <h3 className="panel__title">🎒 Ambassador Status</h3>
          <Link to="/campus-ambassador" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>
            Program details
          </Link>
        </div>
        <div className="panel__body">
          {application === undefined ? (
            <p style={{ color: 'var(--text-muted)' }}>Checking your application…</p>
          ) : application ? (
            <EmptyState
              icon={application.status === 'Approved' ? '🎉' : '⏳'}
              title={application.status === 'Approved' ? 'You are approved!' : 'Application submitted'}
              message={
                application.status === 'Approved'
                  ? 'Head to your ambassador dashboard to see assigned tasks.'
                  : `We received your application on ${formatDate(application.appliedAt)}. Our team reviews applications regularly — if selected, you will be contacted via email or WhatsApp.`
              }
            >
              {application.status === 'Approved' && (
                <Link to="/ambassador/dashboard" className="btn btn--primary btn--sm">Open Dashboard</Link>
              )}
            </EmptyState>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                You are signed in as <strong>{user.name}</strong>. Complete the short application
                below to join the next Campus Ambassador intake. Selection is done manually by
                the NextGen Learners team — no automated approvals.
              </p>
              {error && <div className="alert alert--error">⚠️ {error}</div>}
              <form onSubmit={submit}>
                <div className="form-row">
                  {field('university', 'University / College *', 'e.g. FAST NUCES, Karachi')}
                  {field('city', 'City', 'e.g. Karachi')}
                </div>
                <div className="form-row">
                  {field('program', 'Program / Major *', 'e.g. Computer Science')}
                  {field('year', 'Current Year *', 'e.g. 3rd Year')}
                </div>
                {field('motivation', 'Why do you want to be an ambassador? *', 'Tell us about your campus community and what you would promote.', true)}
                <button className="btn btn--primary" type="submit" disabled={sending}>
                  {sending ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
              <p className="form-hint" style={{ marginTop: 'var(--space-4)' }}>
                Not seeing a confirmation after approval yet? Ambassador approval is handled by
                administrators once the backend is connected — meanwhile use the demo ambassador
                account on the login page to explore the full portal.
              </p>
              <button className="btn btn--outline btn--sm" style={{ marginTop: 'var(--space-4)' }}
                onClick={() => navigate('/login')}>
                Try the demo ambassador account
              </button>
            </>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
