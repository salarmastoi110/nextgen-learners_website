import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import ProjectCard from '../components/cards/ProjectCard';
import { projects } from '../data/projects';
import { useSearch } from '../hooks/useSearch';

export default function Projects() {
  const { term, setTerm, filters, setFilters, results } = useSearch(projects, {
    searchFields: ['title', 'category', 'tech', 'team'],
    filterFn: (item, f) => !f.category || item.category === f.category,
    pageSize: 100,
  });

  const activeCategory = filters.category || null;
  const categories = [...new Set(projects.map((p) => p.category))];
  const shown = results;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Student Projects</h1>
          <p className="page-hero__subtitle">
            Real products built by NGL cohort teams — web apps, mobile apps, data platforms
            and AI tools shipped to real users.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchBar value={term} onChange={setTerm} placeholder="Search projects or technologies…" />
            </div>
            {['All', ...categories].map((category) => (
              <button
                key={category}
                className={`chip ${(category === 'All' && !activeCategory) || category === activeCategory ? 'chip--active' : ''}`}
                onClick={() => setFilters({ category: category === 'All' ? null : category })}
              >
                {category}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon="🛠️"
              title="No projects found"
              message="Try a different keyword or category."
            />
          ) : (
            <div className="content-grid content-grid--3">
              {shown.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
