import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPhone, isNotEmpty, isMinLength, validateForm } from '../../utils/validators';

export default function InternshipApplicationForm({ internship }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    portfolio: '',
    coverLetter: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, error: '' });

  const setValue = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: '' });

    const errs = validateForm(values, {
      fullName: [{ test: (v) => isNotEmpty(v), message: 'Full name is required.' }],
      email: [{ test: (v) => isValidEmail(v), message: 'Enter a valid email address.' }],
      phone: [{ test: (v) => isValidPhone(v), message: 'Enter a valid phone number.' }],
      coverLetter: [
        {
          test: (v) => isMinLength(v, 50),
          message: 'Tell us a bit more — at least 50 characters.',
        },
      ],
    });

    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus({ submitting: false, error: '' });
      return;
    }

    try {
      await applicationService.submit({
        ...values,
        internshipId: internship.id,
        internshipTitle: internship.title,
      });
      navigate('/portal/applications', { state: { justApplied: true } });
    } catch (err) {
      setStatus({ submitting: false, error: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status.error && <div className="alert alert--error">⚠️ {status.error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="app-name">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="app-name"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            value={values.fullName}
            onChange={setValue('fullName')}
            placeholder="Your full name"
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="app-email">
            Email <span className="required">*</span>
          </label>
          <input
            id="app-email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={values.email}
            onChange={setValue('email')}
            placeholder="you@example.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="app-phone">
            Phone <span className="required">*</span>
          </label>
          <input
            id="app-phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={values.phone}
            onChange={setValue('phone')}
            placeholder="+92 300 1234567"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="app-portfolio">
            Portfolio / GitHub <span className="form-hint">(optional)</span>
          </label>
          <input
            id="app-portfolio"
            className="form-input"
            value={values.portfolio}
            onChange={setValue('portfolio')}
            placeholder="https://github.com/you"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="app-cover">
          Why do you want this internship? <span className="required">*</span>
        </label>
        <textarea
          id="app-cover"
          className={`form-textarea ${errors.coverLetter ? 'error' : ''}`}
          rows={6}
          value={values.coverLetter}
          onChange={setValue('coverLetter')}
          placeholder={`Introduce yourself and explain why you're a great fit for the ${internship.title} role…`}
        />
        {errors.coverLetter && <span className="form-error">{errors.coverLetter}</span>}
        <span className="form-hint">
          Minimum 50 characters. Mention relevant projects and skills: {internship.skills.join(', ')}.
        </span>
      </div>

      <Button variant="primary" size="lg" block disabled={status.submitting}>
        {status.submitting ? 'Submitting Application…' : 'Submit Application'}
      </Button>
    </form>
  );
}
