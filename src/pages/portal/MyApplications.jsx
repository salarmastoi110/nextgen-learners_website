import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import ApplicationStatus from '../../components/portal/ApplicationStatus';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { applicationService } from '../../services/applicationService';
import { onApplicationsUpdated } from '../../services/events';
import { studentLinks } from './PortalDashboard';
import { formatDate } from '../../utils/formatters';

const statusBadge = {
  Submitted: 'badge--info',
  'Under Review': 'badge--warning',
  Shortlisted: 'badge--primary',
  Selected: 'badge--success',
  Rejected: 'badge--danger',
};

export default function MyApplications() {
  const location = useLocation();
  const [applications, setApplications] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = () => applicationService.getAll().then(setApplications);

  useEffect(() => {
    load();
    return onApplicationsUpdated(load);
  }, []);

  return (
    <PortalLayout title="My Applications" links={studentLinks}>
      {location.state?.justApplied && (
        <div className="alert alert--success">
          ✅ Your application was submitted successfully.
        </div>
      )}

      {!applications ? (
        <LoadingSpinner label="Loading applications…" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No applications yet"
          message="When you apply to an internship, you can track its progress here."
        >
          <Link to="/portal/internships" className="btn btn--primary btn--sm">
            Browse Internships
          </Link>
        </EmptyState>
      ) : (
        <div className="content-grid content-grid--2">
          {applications.map((application) => (
            <div key={application.id} className="panel" style={{ marginBottom: 0 }}>
              <div className="panel__header">
                <div>
                  <h3 className="panel__title">{application.internshipTitle}</h3>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    Applied {formatDate(application.appliedAt)}
                  </span>
                </div>
                <span className={`badge ${statusBadge[application.status]}`}>
                  {application.status}
                </span>
              </div>
              <div className="panel__body">
                <ApplicationStatus application={application} />
                <button
                  className="btn btn--ghost btn--sm"
                  style={{ marginTop: 'var(--space-4)' }}
                  onClick={() => setExpanded(expanded === application.id ? null : application.id)}
                >
                  {expanded === application.id ? 'Hide' : 'View'} my cover letter
                </button>
                {expanded === application.id && (
                  <p
                    className="animate-in"
                    style={{
                      marginTop: 'var(--space-3)',
                      padding: 'var(--space-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {application.coverLetter}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
