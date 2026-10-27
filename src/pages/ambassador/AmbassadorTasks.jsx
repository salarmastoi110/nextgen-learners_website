import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export default function AmbassadorTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    Promise.all([ambassadorService.getTasks(), ambassadorService.getSubmissions(user.email)])
      .then(([t, s]) => {
        setTasks(t);
        setSubmissions(s);
      });
  }, [user.email]);

  const statusFor = (taskId) => {
    const sub = submissions.find((s) => s.taskId === taskId);
    if (!sub) return null;
    return sub.status;
  };

  return (
    <PortalLayout
      title="My Tasks"
      links={ambassadorLinks}
      brandLabel="Ambassador Portal"
      actions={<Link to="/ambassador/submit" className="btn btn--primary btn--sm">Submit a Task</Link>}
    >
      {!tasks ? (
        <LoadingSpinner label="Loading tasks…" />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No tasks assigned yet"
          message="Administrators create and assign real tasks. New tasks will appear here as soon as they are published."
        />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const status = statusFor(task.id);
                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{task.title}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{task.description}</div>
                      </td>
                      <td>{task.type}</td>
                      <td>{task.points} pts</td>
                      <td>{formatDate(task.deadline)}</td>
                      <td>
                        {status ? (
                          <span className={`badge badge--${status === 'Approved' ? 'success' : status === 'Submitted' ? 'info' : 'warning'}`}>
                            {status}
                          </span>
                        ) : (
                          <span className="badge badge--dark">Assigned</span>
                        )}
                      </td>
                      <td>
                        {!status && (
                          <Link to={`/ambassador/submit?task=${task.id}`} className="btn btn--outline btn--sm">
                            Submit
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
