import PortalLayout from '../../components/layout/PortalLayout';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorResources } from '../../data/ambassadorContent';
import { siteConfig, mailto } from '../../utils/siteConfig';

/**
 * Campaign resources. Actual files are attached by administrators per
 * campaign — until then each card honestly shows "shared with each task".
 */
export default function AmbassadorResources() {
  return (
    <PortalLayout title="Resources" links={ambassadorLinks} brandLabel="Ambassador Portal">
      <div className="content-grid content-grid--2">
        {ambassadorResources.map((resource) => (
          <div key={resource.title} className="panel">
            <div className="panel__header">
              <h3 className="panel__title">
                <span aria-hidden>{resource.icon}</span> {resource.title}
              </h3>
            </div>
            <div className="panel__body">
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{resource.desc}</p>
              <span className="badge badge--info">Shared with each official campaign</span>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 'var(--space-8)' }}>
        <div className="panel__body" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            Need something specific for your campus? Ask the NextGen Learners team.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center', marginBottom: 0 }}>
            <a className="btn btn--primary btn--sm" href={mailto}>{siteConfig.email}</a>
            <a className="btn btn--outline btn--sm" href={siteConfig.whatsapp.chat} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
