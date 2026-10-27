import { useEffect, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { useAuth } from '../../context/AuthContext';

const rankStyle = (rank) =>
  rank === 1
    ? { background: '#fef3c7', color: '#92400e' }
    : rank === 2
      ? { background: '#e5e7eb', color: '#374151' }
      : rank === 3
        ? { background: '#ffe4d6', color: '#9a3412' }
        : { background: 'var(--gray-100)', color: 'var(--text-secondary)' };

/** Leaderboard ranks strictly on approved, admin-awarded points — genuine records only. */
export default function AmbassadorLeaderboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    ambassadorService.getLeaderboard().then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <PortalLayout title="Leaderboard" links={ambassadorLinks} brandLabel="Ambassador Portal">
      {!rows ? (
        <LoadingSpinner label="Loading leaderboard…" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="The leaderboard is warming up"
          message="Rankings appear once the first task submissions are approved by administrators — points only come from genuine, reviewed work."
        />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Ambassador</th>
                  <th>Approved Tasks</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.email} style={row.email === user.email ? { background: 'var(--color-primary-light)' } : undefined}>
                    <td>
                      <span
                        style={{
                          ...rankStyle(i + 1),
                          width: 30, height: 30, borderRadius: '50%', display: 'inline-flex',
                          alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>
                        {row.name} {row.email === user.email && <span className="badge badge--primary">You</span>}
                      </div>
                    </td>
                    <td>{row.approvedTasks}</td>
                    <td style={{ fontWeight: 800 }}>🏅 {row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
