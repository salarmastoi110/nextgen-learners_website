import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  isValidEmail,
  isNotEmpty,
  isStrongPassword,
  validateForm,
} from '../../utils/validators';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setValue = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateForm(values, {
      name: [{ test: (v) => isNotEmpty(v), message: 'Your full name is required.' }],
      email: [{ test: (v) => isValidEmail(v), message: 'Enter a valid email address.' }],
      password: [
        {
          test: isStrongPassword,
          message: 'Password needs 8+ characters with an uppercase letter, lowercase letter and number.',
        },
      ],
      confirmPassword: [
        { test: (v) => v === values.password, message: 'Passwords do not match.' },
      ],
    });

    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      navigate('/portal/dashboard');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert alert--error">⚠️ {formError}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="register-name">
          Full Name <span className="required">*</span>
        </label>
        <input
          id="register-name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={values.name}
          onChange={setValue('name')}
          placeholder="Ali Raza"
          autoComplete="name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="register-email">
          Email <span className="required">*</span>
        </label>
        <input
          id="register-email"
          type="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          value={values.email}
          onChange={setValue('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="register-password">
            Password <span className="required">*</span>
          </label>
          <input
            id="register-password"
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            value={values.password}
            onChange={setValue('password')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="register-confirm">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            id="register-confirm"
            type="password"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            value={values.confirmPassword}
            onChange={setValue('confirmPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      <p className="form-hint" style={{ marginBottom: 'var(--space-5)' }}>
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </p>

      <Button variant="primary" size="lg" block disabled={submitting}>
        {submitting ? 'Creating Account…' : 'Create Account'}
      </Button>
    </form>
  );
}
