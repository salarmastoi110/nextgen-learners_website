import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import InternshipApplicationForm from '../../components/forms/InternshipApplicationForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { internshipService } from '../../services/internshipService';
import { studentLinks } from './PortalDashboard';

export default function ApplyInternship({ appliedNotice = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);

  useEffect(() => {
    internshipService
      .getById(id)
      .then(setInternship)
      .catch(() => navigate('/internships'));
  }, [id, navigate]);

  return (
    <PortalLayout title="Internship Application" links={studentLinks}>
      {appliedNotice && (
        <div className="alert alert--success">
          ✅ Application submitted! Track its progress under My Applications.
        </div>
      )}
      {!internship ? (
        <LoadingSpinner label="Loading role details…" />
      ) : (
        <div className="details-grid" style={{ gridTemplateColumns: '1fr 320px' }}>
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Your details & motivation</h3>
            </div>
            <div className="panel__body">
              <InternshipApplicationForm internship={internship} />
            </div>
          </div>

          <aside>
            <div className="panel">
              <div className="panel__body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                  <span
                    style={{
                      width: 52, height: 52, borderRadius: 'var(--border-radius)',
                      background: internship.gradient, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    {internship.icon}
                  </span>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)' }}>{internship.title}</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {internship.company}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {internship.summary}
                </p>
                <div className="listing-card__tags" style={{ marginBottom: 'var(--space-5)' }}>
                  {internship.skills.map((skill) => (
                    <span key={skill} className="badge">{skill}</span>
                  ))}
                </div>
                <Link to={`/internships/${internship.id}`} className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>
                  Read the full role description →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </PortalLayout>
  );
}
