import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { authService } from '../services/authService';
import { isValidEmail } from '../utils/validators';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ submitting: false, sent: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setState((s) => ({ ...s, error: 'Enter a valid email address.' }));

    setState({ submitting: true, sent: false, error: '' });
    try {
      await authService.requestPasswordReset(email);
      setState({ submitting: false, sent: true, error: '' });
    } catch (err) {
      setState({ submitting: false, sent: false, error: err.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset your password</h1>
        <p className="auth-card__subtitle">
          Enter the email you use for NextGen Learners and we'll send you a secure reset link.
        </p>

        {state.sent ? (
          <div className="alert alert--success">
            ✅ Reset instructions sent to <strong>{email}</strong>. Check your inbox (and spam
            folder) — the link expires in 30 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {state.error && <div className="alert alert--error">⚠️ {state.error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState((s) => ({ ...s, error: '' }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <Button variant="primary" size="lg" block disabled={state.submitting}>
              {state.submitting ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <p className="auth-card__footer">
          Remembered it? <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
