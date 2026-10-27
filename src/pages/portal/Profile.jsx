import { useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import ProfileCard from '../../components/portal/ProfileCard';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isNotEmpty, isValidPhone } from '../../utils/validators';
import { studentLinks } from '../../data/portalNavigation';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [status, setStatus] = useState({ saving: false, error: '', saved: false });

  const setValue = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setStatus((s) => ({ ...s, error: '', saved: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNotEmpty(form.name)) return setStatus({ saving: false, error: 'Name is required.', saved: false });
    if (!isValidEmail(form.email)) return setStatus({ saving: false, error: 'Enter a valid email.', saved: false });
    if (form.phone && !isValidPhone(form.phone))
      return setStatus({ saving: false, error: 'Enter a valid phone number.', saved: false });

    setStatus({ saving: true, error: '', saved: false });
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setStatus({ saving: false, error: '', saved: true });
    } catch (err) {
      setStatus({ saving: false, error: err.message, saved: false });
    }
  };

  return (
    <PortalLayout title="My Profile" links={studentLinks}>
      <div className="profile-grid">
        <ProfileCard user={user} />

        <div className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Edit profile</h3>
          </div>
          <div className="panel__body">
            {status.saved && <div className="alert alert--success">✅ Profile updated.</div>}
            {status.error && <div className="alert alert--error">⚠️ {status.error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" className="form-input" value={form.name} onChange={setValue('name')} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">Email</label>
                  <input id="profile-email" type="email" className="form-input" value={form.email} onChange={setValue('email')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">Phone</label>
                  <input id="profile-phone" className="form-input" value={form.phone} onChange={setValue('phone')} placeholder="+92 300 1234567" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-skills">Skills (comma-separated)</label>
                  <input id="profile-skills" className="form-input" value={form.skills} onChange={setValue('skills')} placeholder="React, Python, Figma" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Short Bio</label>
                <textarea
                  id="profile-bio"
                  className="form-textarea"
                  value={form.bio}
                  onChange={setValue('bio')}
                  placeholder="A sentence or two about you — shown to internship reviewers."
                />
              </div>

              <Button variant="primary" disabled={status.saving}>
                {status.saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
