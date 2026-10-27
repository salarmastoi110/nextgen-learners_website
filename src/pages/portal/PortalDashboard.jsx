import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import StatCard from '../../components/portal/StatCard';
import ProfileCard from '../../components/portal/ProfileCard';
import ApplicationStatus from '../../components/portal/ApplicationStatus';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { courseService } from '../../services/courseService';
import { certificateService } from '../../services/certificateService';
import { internshipService } from '../../services/internshipService';
import { onApplicationsUpdated, onEnrollmentsUpdated } from '../../services/events';
import { courses } from '../../data/courses';
import { formatDate } from '../../utils/formatters';
import { studentLinks } from '../../data/portalNavigation';

export { studentLinks };

export default function PortalDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => {
      Promise.all([
        applicationService.getAll(),
        courseService.getEnrollments(),
        certificateService.getMyCertificates(),
        internshipService.getAll(),
      ]).then(([applications, enrollments, certificates, internships]) =>
        setData({ applications, enrollments, certificates, internships })
      );
    };
    load();
    const offApps = onApplicationsUpdated(load);
    const offEnr = onEnrollmentsUpdated(load);
    return () => {
      offApps();
      offEnr();
    };
  }, []);

  if (!data) {
    return (
      <PortalLayout title="Dashboard" links={studentLinks}>
        <LoadingSpinner label="Loading your dashboard…" />
      </PortalLayout>
    );
  }

  const { applications, enrollments, certificates, internships } = data;
  const activeApps = applications.filter((a) => !['Selected', 'Rejected'].includes(a.status));
  const inProgress = enrollments.filter((e) => e.progress < 100);
  const recommended = internships.filter((i) => i.status !== 'Closed').slice(0, 3);

  return (
    <PortalLayout
      title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
      links={studentLinks}
      actions={
        <Link to="/portal/internships" className="btn btn--primary btn--sm">
          Find Internships
        </Link>
      }
    >
      <div className="stat-grid">
        <StatCard icon="📄" label="Active Applications" value={activeApps.length} color="var(--indigo-100)" iconColor="var(--indigo-700)" />
        <StatCard icon="📚" label="Courses In Progress" value={inProgress.length} color="var(--teal-100)" iconColor="var(--teal-700)" />
        <StatCard icon="🏅" label="Certificates Earned" value={certificates.length} color="#fef3c7" iconColor="#92400e" />
        <StatCard icon="💼" label="Open Internships" value={internships.filter((i) => i.status !== 'Closed').length} color="#dcfce7" iconColor="#166534" />
      </div>

      <div className="profile-grid">
        <div>
          <ProfileCard
            user={user}
            stats={[
              { label: 'Applications', value: applications.length },
              { label: 'Courses', value: enrollments.length },
              { label: 'Certificates', value: certificates.length },
            ]}
          />

          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Recommended for you</h3>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {recommended.map((internship) => (
                <Link
                  key={internship.id}
                  to={`/internships/${internship.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                >
                  <span
                    style={{
                      width: 44, height: 44, borderRadius: 'var(--border-radius-sm)',
                      background: internship.gradient, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    {internship.icon}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{internship.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      {internship.company} · Apply before {formatDate(internship.deadline)}
                    </div>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Latest application status</h3>
              <Link to="/portal/applications" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>
                View all
              </Link>
            </div>
            <div className="panel__body">
              {applications.length === 0 ? (
                <EmptyState
                  icon="📄"
                  title="No applications yet"
                  message="Browse open internships and submit your first application."
                >
                  <Link to="/portal/internships" className="btn btn--primary btn--sm">
                    Browse Internships
                  </Link>
                </EmptyState>
              ) : (
                <ApplicationStatus application={applications[0]} />
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Course progress</h3>
              <Link to="/portal/courses" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>
                My courses
              </Link>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-5)' }}>
              {enrollments.length === 0 && (
                <EmptyState icon="📚" title="Not enrolled in any course" />
              )}
              {enrollments.slice(0, 4).map((enrollment) => {
                const course = courses.find((c) => c.id === enrollment.courseId);
                if (!course) return null;
                return (
                  <div key={enrollment.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{course.title}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="progress">
                      <div className="progress__bar" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
