import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { certificateService } from '../../services/certificateService';
import { studentLinks } from './PortalDashboard';
import { formatDate } from '../../utils/formatters';

export default function MyCertificates() {
  const [certificates, setCertificates] = useState(null);

  useEffect(() => {
    certificateService.getMyCertificates().then(setCertificates);
  }, []);

  return (
    <PortalLayout
      title="My Certificates"
      links={studentLinks}
      actions={
        <Link to="/verify-certificate" className="btn btn--outline btn--sm">
          Public Verification Page
        </Link>
      }
    >
      {!certificates ? (
        <LoadingSpinner label="Loading certificates…" />
      ) : certificates.length === 0 ? (
        <EmptyState
          icon="🏅"
          title="No certificates yet"
          message="Complete an internship or finish a course to earn your first verifiable certificate."
        >
          <Link to="/courses" className="btn btn--primary btn--sm">
            Browse Courses
          </Link>
        </EmptyState>
      ) : (
        <div className="content-grid content-grid--3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {certificates.map((certificate) => (
            <div key={certificate.code} className="certificate-card">
              <div className="certificate-card__seal" aria-hidden>
                🏅
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)' }}>{certificate.courseTitle}</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 'var(--space-2) 0' }}>
                Awarded to {certificate.holder} · {formatDate(certificate.issuedAt)}
              </p>
              <span className="badge badge--success">{certificate.status}</span>
              <div>
                <span className="certificate-card__code">{certificate.code}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to={`/verify-certificate?code=${certificate.code}`}
                  className="btn btn--outline btn--sm"
                >
                  Verify
                </Link>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `${certificate.code} — verified at nextgenlearners.com/verify-certificate?code=${certificate.code}`
                    )
                  }
                >
                  📋 Copy verification link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
