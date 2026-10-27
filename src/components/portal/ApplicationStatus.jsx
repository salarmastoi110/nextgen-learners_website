import { formatDateTime } from '../../utils/formatters';

const STAGES = ['Submitted', 'Under Review', 'Shortlisted', 'Selected'];

const badgeForStatus = {
  Submitted: 'badge--info',
  'Under Review': 'badge--warning',
  Shortlisted: 'badge--primary',
  Selected: 'badge--success',
  Rejected: 'badge--danger',
};

export default function ApplicationStatus({ application }) {
  const { status, appliedAt, internshipTitle } = application;

  if (status === 'Rejected') {
    return (
      <div className="status-timeline">
        <div className="status-step status-step--done">
          <span className="status-step__dot">✓</span>
          <div>
            <div className="status-step__title">Submitted — {internshipTitle}</div>
            <div className="status-step__meta">{formatDateTime(appliedAt)}</div>
          </div>
        </div>
        <div className="status-step status-step--rejected">
          <span className="status-step__dot">✕</span>
          <div>
            <div className="status-step__title">Not selected this time</div>
            <div className="status-step__meta">
              Feedback is available in your portal — keep applying, momentum wins.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="status-timeline">
      {STAGES.map((stage, i) => {
        const state =
          i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
        return (
          <div key={stage} className={`status-step status-step--${state}`}>
            <span className="status-step__dot">{state === 'done' ? '✓' : i + 1}</span>
            <div>
              <div className="status-step__title">
                {stage}{' '}
                {state === 'active' && (
                  <span className={`badge ${badgeForStatus[status]}`} style={{ marginLeft: '0.5rem' }}>
                    current
                  </span>
                )}
              </div>
              <div className="status-step__meta">
                {i === 0 ? formatDateTime(appliedAt) : state === 'pending' ? 'Awaiting review' : 'Completed'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
