import { useEffect, useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import CourseCard from '../components/cards/CourseCard';
import { courseService } from '../services/courseService';
import { useSearch } from '../hooks/useSearch';

export default function Courses() {
  const [all, setAll] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService.getAll().then(setAll).catch((e) => setError(e.message));
  }, []);

  const { term, setTerm, filters, setFilters, page, setPage, results, total, totalPages } =
    useSearch(all || [], {
      searchFields: ['title', 'category', 'tags', 'instructor'],
      filterFn: (item, f) => (!f.category || item.category === f.category) && (!f.level || item.level === f.level),
      pageSize: 6,
    });

  const categories = [...new Set((all || []).map((c) => c.category))];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Courses</h1>
          <p className="page-hero__subtitle">
            Industry-designed, project-driven training. Every course ends with a portfolio
            project and a verifiable certificate.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchBar value={term} onChange={setTerm} placeholder="Search courses, topics or instructors…" />
            </div>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filters.category || ''}
              onChange={(e) => setFilters({ category: e.target.value || null })}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filters.level || ''}
              onChange={(e) => setFilters({ level: e.target.value || null })}
              aria-label="Filter by level"
            >
              <option value="">All levels</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {error && <div className="alert alert--error">⚠️ {error}</div>}

          {!all ? (
            <LoadingSpinner label="Loading courses…" />
          ) : results.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No courses found"
              message="Try a different keyword or adjust your filters."
            />
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                Showing {results.length} of {total} courses
              </p>
              <div className="content-grid content-grid--3">
                {results.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
