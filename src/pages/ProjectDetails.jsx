import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { projects } from '../data/projects';
import ProjectCard from '../components/cards/ProjectCard';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(undefined);

  useEffect(() => {
    // Simulate fetch delay for a consistent loading experience
    const t = setTimeout(
      () => setProject(projects.find((p) => p.id === id) || null),
      300
    );
    return () => clearTimeout(t);
  }, [id]);

  if (project === undefined) return <LoadingSpinner label="Loading project…" />;

  if (!project) {
    return (
      <div className="section container">
        <div className="alert alert--error">⚠️ Project not found.</div>
        <Link to="/projects" className="btn btn--outline">← Back to projects</Link>
      </div>
    );
  }

  const related = projects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const { title, category, team, members, duration, year, icon, gradient, tech, summary, description, highlights, impact, repoUrl } =
    project;

  return (
    <>
      <div className="page-hero" style={{ textAlign: 'left' }}>
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/projects">Projects</Link> / <span>{title}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <span
              style={{
                width: 72, height: 72, borderRadius: 'var(--border-radius-lg)',
                background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', flexShrink: 0,
              }}
              aria-hidden
            >
              {icon}
            </span>
            <div>
              <h1 className="page-hero__title" style={{ marginBottom: 'var(--space-1)' }}>{title}</h1>
              <p className="page-hero__subtitle" style={{ margin: 0 }}>
                {category} · {team} · {year}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div>
              <div className="prose">
                <p><strong>{summary}</strong></p>
                <p>{description}</p>

                <h3>Project highlights</h3>
                <ul>
                  {highlights.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>

              <div
                className="alert alert--info"
                style={{ marginTop: 'var(--space-8)', alignItems: 'center' }}
              >
                📈 {impact}
              </div>
            </div>

            <aside className="details-sidebar">
              <div className="panel">
                <div className="panel__body">
                  <h3 style={{ marginBottom: 'var(--space-5)' }}>Project Facts</h3>
                  {[
                    ['Team size', `${members} students`],
                    ['Build time', duration],
                    ['Completed', String(year)],
                    ['Track', category],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)',
                        padding: 'var(--space-3) 0', borderBottom: '1px solid var(--gray-100)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}

                  <h4 style={{ margin: 'var(--space-5) 0 var(--space-3)' }}>Built with</h4>
                  <div className="listing-card__tags">
                    {tech.map((t) => (
                      <span key={t} className="badge badge--primary">{t}</span>
                    ))}
                  </div>

                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--secondary btn--block"
                    style={{ marginTop: 'var(--space-6)' }}
                  >
                    View on GitHub
                  </a>
                  <Link to="/contact" className="btn btn--ghost btn--block" style={{ marginTop: 'var(--space-3)' }}>
                    Want a project like this?
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <>
              <h2 style={{ margin: 'var(--space-16) 0 var(--space-8)' }}>More {category} projects</h2>
              <div className="content-grid content-grid--3">
                {related.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
