import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DISMISS_KEY = 'ngl_announcement_dismissed';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== new Date().toISOString().slice(0, 10));
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, new Date().toISOString().slice(0, 10));
    document.body.classList.add('announcement-hidden');
  };

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <span>
        🎓 Fall 2026 internship applications are open —{' '}
        <Link to="/internships">apply before deadlines close</Link>
      </span>
      <button className="announcement-bar__close" onClick={dismiss} aria-label="Dismiss announcement">
        ×
      </button>
    </div>
  );
}
