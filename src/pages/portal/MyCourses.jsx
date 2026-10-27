import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { courseService } from '../../services/courseService';
import { onEnrollmentsUpdated } from '../../services/events';
import { studentLinks } from './PortalDashboard';
import { courses } from '../../data/courses';
import { formatDate } from '../../utils/formatters';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState(null);

  const load = () => courseService.getEnrollments().then(setEnrollments);

  useEffect(() => {
    load();
    return onEnrollmentsUpdated(load);
  }, []);

  return (
    <PortalLayout
      title="My Courses"
      links={studentLinks}
      actions={
        <Link to="/courses" className="btn btn--primary btn--sm">
          Browse Courses
        </Link>
      }
    >
      {!enrollments ? (
        <LoadingSpinner label="Loading your courses…" />
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No enrolments yet"
          message="Enrol in a course to start learning — progress and certificates appear here."
        >
          <Link to="/courses" className="btn btn--primary btn--sm">
            Explore Catalogue
          </Link>
        </EmptyState>
      ) : (
        <div className="content-grid content-grid--2">
          {enrollments.map((enrollment) => {
            const course = courses.find((c) => c.id === enrollment.courseId);
            if (!course) return null;
            const complete = enrollment.progress >= 100;
            return (
              <div key={enrollment.id} className="panel" style={{ marginBottom: 0 }}>
                <div className="panel__body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                    <span
                      style={{
                        width: 52, height: 52, borderRadius: 'var(--border-radius)',
                        background: course.gradient, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                      }}
                      aria-hidden
                    >
                      {course.icon}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 className="panel__title">{course.title}</h3>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        Enrolled {formatDate(enrollment.enrolledAt)} · {course.instructor}
                      </span>
                    </div>
                    {complete && <span className="badge badge--success">Completed</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Progress</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="progress" style={{ marginBottom: 'var(--space-5)' }}>
                    <div className="progress__bar" style={{ width: `${enrollment.progress}%` }} />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <Link to={`/courses/${course.id}`} className="btn btn--outline btn--sm">
                      {complete ? 'Review Course' : 'Continue Learning'}
                    </Link>
                    {complete ? (
                      <Link to="/portal/certificates" className="btn btn--ghost btn--sm">
                        🏅 View Certificate
                      </Link>
                    ) : (
                      <span className="badge badge--info" style={{ alignSelf: 'center' }}>
                        🎞️ {Math.round((course.lessons * enrollment.progress) / 100)} of {course.lessons} lessons done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}
