import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ACCOUNTS } from '../../utils/constants';
import { MOCK_ENABLED } from '../../services/api';
import { isValidEmail } from '../../utils/validators';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setValue = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(values.email)) return setError('Enter a valid email address.');
    if (!values.password) return setError('Enter your password.');

    setSubmitting(true);
    try {
      const user = await login(values);
      const home =
        user.role === 'admin' ? '/admin' : user.role === 'ambassador' ? '/ambassador/dashboard' : '/portal/dashboard';
      navigate(home);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (account) => {
    setValues({ email: account.email, password: account.password });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert--error">⚠️ {error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className="form-input"
          value={values.email}
          onChange={setValue('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          value={values.password}
          onChange={setValue('password')}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <Button variant="primary" size="lg" block disabled={submitting}>
        {submitting ? 'Signing In…' : 'Sign In'}
      </Button>

      {MOCK_ENABLED && (
        <>
          <div className="divider">Demo accounts</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <Button key={account.email} variant="outline" size="sm" type="button" onClick={() => fillDemo(account)}>
                {account.role === 'student' ? '🎓 Student' : account.role === 'ambassador' ? '🎒 Ambassador' : '🛠️ Admin'}
              </Button>
            ))}
          </div>
        </>
      )}
    </form>
  );
}
