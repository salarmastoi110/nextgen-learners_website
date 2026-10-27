import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { useAuth } from '../../context/AuthContext';

export default function SubmitTask() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [tasks, setTasks] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    taskId: params.get('task') || '',
    description: '',
    completionDate: '',
    evidenceUrl: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([ambassadorService.getTasks(), ambassadorService.getSubmissions(user.email)])
      .then(([t, s]) => {
        setTasks(t);
        setSubmissions(s);
      });
  }, [user.email]);

  const alreadySubmitted = (taskId) =>
    submissions.some((s) => s.taskId === taskId && s.status !== 'Revisions Required');

  const availableTasks = (tasks || []).filter((t) => !alreadySubmitted(t.id));

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.taskId) return setError('Please choose a task.');
    if (!form.description.trim() || !form.completionDate) {
      return setError('Description and completion date are required.');
    }
    setSending(true);
    setError('');
    try {
      await ambassadorService.submitTask({ ...form, email: user.email, name: user.name });
      setDone('Submission received! An administrator will review it and award points if approved.');
      setForm({ ...form, taskId: '', description: '', completionDate: '', evidenceUrl: '', notes: '' });
      setSubmissions(await ambassadorService.getSubmissions(user.email));
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalLayout
      title="Submit a Task"
      links={ambassadorLinks}
      brandLabel="Ambassador Portal"
      actions={<Link to="/ambassador/submissions" className="btn btn--outline btn--sm">My Submissions</Link>}
    >
      {!tasks ? (
        <LoadingSpinner label="Loading tasks…" />
      ) : (
        <div className="panel" style={{ maxWidth: 720 }}>
          <div className="panel__header">
            <h3 className="panel__title">📤 Task Submission</h3>
          </div>
          <div className="panel__body">
            {availableTasks.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No tasks available to submit"
                message="Complete your assigned tasks first, or wait for administrators to publish new ones."
              />
            ) : (
              <>
                {done && <div className="alert alert--success">✅ {done}</div>}
                {error && <div className="alert alert--error">⚠️ {error}</div>}
                <form onSubmit={submit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="task">Task ID / Title *</label>
                    <select id="task" className="form-select" value={form.taskId} onChange={set('taskId')}>
                      <option value="">Select an active task…</option>
                      {availableTasks.map((t) => (
                        <option key={t.id} value={t.id}>{t.title} ({t.points} pts)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="desc">Description of work done *</label>
                    <textarea id="desc" className="form-textarea" rows={4} placeholder="What did you do, where and with what result?"
                      value={form.description} onChange={set('description')} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="date">Completion date *</label>
                      <input id="date" className="form-input" type="date" value={form.completionDate} onChange={set('completionDate')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="evidence">Evidence URL</label>
                      <input id="evidence" className="form-input" type="url" placeholder="https://… (post, story, doc link)"
                        value={form.evidenceUrl} onChange={set('evidenceUrl')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">Notes for the reviewer</label>
                    <textarea id="notes" className="form-textarea" rows={2} placeholder="Optional context for the admin reviewing your work"
                      value={form.notes} onChange={set('notes')} />
                  </div>
                  <button className="btn btn--primary" type="submit" disabled={sending}>
                    {sending ? 'Submitting…' : 'Submit for Review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
