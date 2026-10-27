import { useState } from 'react';
import PortalSidebar from '../portal/PortalSidebar';
import PortalHeader from '../portal/PortalHeader';

export default function PortalLayout({ title, actions, children, links, brandLabel }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="portal">
      <PortalSidebar
        links={links}
        brandLabel={brandLabel}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="portal-main">
        <PortalHeader
          title={title}
          actions={actions}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="portal-content animate-in">{children}</div>
      </div>
    </div>
  );
}
