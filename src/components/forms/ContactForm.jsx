import { useState } from 'react';
import Button from '../common/Button';
import { readStore, writeStore, generateId } from '../../services/api';
import { MESSAGES_STORAGE_KEY } from '../../utils/constants';
import { notifyMessagesUpdated } from '../../services/events';
import { isValidEmail, isNotEmpty, validateForm } from '../../utils/validators';

const initialValues = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  const setValue = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: '' });

    const errs = validateForm(values, {
      name: [{ test: (v) => isNotEmpty(v), message: 'Your name is required.' }],
      email: [{ test: (v) => isValidEmail(v), message: 'Enter a valid email address.' }],
      subject: [{ test: (v) => isNotEmpty(v), message: 'Add a short subject.' }],
      message: [
        { test: (v) => isNotEmpty(v), message: 'Write your message.' },
        { test: (v) => v.length >= 20, message: 'Message should be at least 20 characters.' },
      ],
    });

    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus({ submitting: false, success: false, error: '' });
      return;
    }

    // Mock persistence — becomes POST /contact with the backend.
    const messages = readStore(MESSAGES_STORAGE_KEY);
    writeStore(MESSAGES_STORAGE_KEY, [
      { id: generateId('msg'), ...values, createdAt: new Date().toISOString(), read: false },
      ...messages,
    ]);
    notifyMessagesUpdated();

    setValues(initialValues);
    setStatus({ submitting: false, success: true, error: '' });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status.success && (
        <div className="alert alert--success">
          ✅ Message sent! Our team replies within one business day.
        </div>
      )}
      {status.error && <div className="alert alert--error">⚠️ {status.error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="contact-name">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="contact-name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={values.name}
            onChange={setValue('name')}
            placeholder="Ali Raza"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contact-email">
            Email <span className="required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={values.email}
            onChange={setValue('email')}
            placeholder="you@example.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-subject">
          Subject <span className="required">*</span>
        </label>
        <input
          id="contact-subject"
          className={`form-input ${errors.subject ? 'error' : ''}`}
          value={values.subject}
          onChange={setValue('subject')}
          placeholder="Question about internships…"
        />
        {errors.subject && <span className="form-error">{errors.subject}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">
          Message <span className="required">*</span>
        </label>
        <textarea
          id="contact-message"
          className={`form-textarea ${errors.message ? 'error' : ''}`}
          value={values.message}
          onChange={setValue('message')}
          placeholder="Tell us how we can help…"
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      <Button variant="primary" size="lg" block disabled={status.submitting}>
        {status.submitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
