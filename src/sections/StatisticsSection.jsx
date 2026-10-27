import { useEffect, useRef, useState } from 'react';
import { statistics } from '../data/dashboard';

function useCountUp(target, duration = 1500, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    const tick = (t) => {
      const progress = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}

function StatItem({ value, suffix, label, start }) {
  const count = useCountUp(value, 1600, start);
  return (
    <div>
      <div className="stats-grid__value">
        {count.toLocaleString()}
        <span>{suffix}</span>
      </div>
      <div className="stats-grid__label">{label}</div>
    </div>
  );
}

export default function StatisticsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="stats-band" ref={ref}>
          <div className="stats-grid">
            {statistics.map((stat) => (
              <StatItem key={stat.label} {...stat} start={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
