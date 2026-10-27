import { useEffect, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import StatCard from '../../components/portal/StatCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { adminLinks } from '../../data/portalNavigation';
import { readMessages, messageService } from '../../services/messages';
import { onMessagesUpdated } from '../../services/events';
import { useSearch } from '../../hooks/useSearch';
import { timeAgo } from '../../utils/formatters';

export default function ManageMessages() {
  const [messages, setMessages] = useState(() => readMessages());
  const [openId, setOpenId] = useState(null);

  const load = () => setMessages(readMessages());

  useEffect(() => {
    load();
    return onMessagesUpdated(load);
  }, []);

  const { term, setTerm, filters, setFilters, results } = useSearch(messages, {
    searchFields: ['name', 'email', 'subject', 'message'],
    filterFn: (m, f) => (f.view === 'unread' ? !m.read : f.view === 'read' ? m.read : true),
    pageSize: 100,
  });

  const openMessage = (m) => {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) messageService.markRead(m.id, true);
  };

  const remove = (id) => {
    if (confirm('Delete this message?')) messageService.remove(id);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <PortalLayout title="Manage Messages" links={adminLinks} brandLabel="Admin Panel">
      <div className="stat-grid">
        <StatCard icon="✉️" label="Total Messages" value={messages.length} color="var(--teal-100)" iconColor="var(--teal-700)" />
        <StatCard icon="🔵" label="Unread" value={unread} color="var(--indigo-100)" iconColor="var(--indigo-700)" />
      </div>

      <div className="admin-toolbar">
        <SearchBar value={term} onChange={setTerm} placeholder="Search messages…" />
        <select
          className="filter-select"
          value={filters.view || ''}
          onChange={(e) => setFilters({ view: e.target.value || null })}
        >
          <option value="">All messages</option>
          <option value="unread">Unread only</option>
          <option value="read">Read only</option>
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState icon="✉️" title="No messages" message="Contact-form submissions from the public site will appear here." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((m) => (
                <tr key={m.id}>
                  <td>
                    {!m.read && <span className="unread-dot" aria-label="unread" />}
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{m.email}</div>
                  </td>
                  <td>{m.subject}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{timeAgo(m.createdAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="Toggle full message" onClick={() => openMessage(m)}>✉️</button>
                      <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(m.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openId && (() => {
        const m = messages.find((x) => x.id === openId);
        if (!m) return null;
        return (
          <div className="panel animate-in" style={{ marginTop: 'var(--space-5)' }}>
            <div className="panel__header">
              <h3 className="panel__title">{m.subject}</h3>
              <a className="auth-card__link" href={`mailto:${m.email}`}>Reply →</a>
            </div>
            <div className="panel__body">
              <p style={{ marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>{m.message}</p>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                From <strong>{m.name}</strong> · {m.email}
              </div>
              <Button variant="ghost" size="sm" style={{ marginTop: 'var(--space-4)' }} onClick={() => setOpenId(null)}>
                Close
              </Button>
            </div>
          </div>
        );
      })()}
    </PortalLayout>
  );
}
