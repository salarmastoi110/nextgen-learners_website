import { useEffect, useState } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import InternshipCard from '../components/cards/InternshipCard';
import { internshipService } from '../services/internshipService';
import { useSearch } from '../hooks/useSearch';
import { INTERNSHIP_TYPES } from '../utils/constants';

export default function Internships() {
  const [all, setAll] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    internshipService.getAll().then(setAll).catch((e) => setError(e.message));
  }, []);

  const { term, setTerm, filters, setFilters, page, setPage, results, total, totalPages } =
    useSearch(all || [], {
      searchFields: ['title', 'company', 'location', 'skills'],
      filterFn: (item, f) => (!f.type || item.type === f.type) && (!f.level || item.level === f.level),
      pageSize: 6,
    });

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Open Internships</h1>
          <p className="page-hero__subtitle">
            Verified roles from our partner network — every internship includes mentorship
            and a verifiable completion certificate.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchBar
                value={term}
                onChange={setTerm}
                placeholder="Search by role, company, skill or city…"
              />
            </div>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filters.type || ''}
              onChange={(e) => setFilters({ type: e.target.value || null })}
              aria-label="Filter by work type"
            >
              <option value="">All types</option>
              {INTERNSHIP_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filters.level || ''}
              onChange={(e) => setFilters({ level: e.target.value || null })}
              aria-label="Filter by level"
            >
              <option value="">All levels</option>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {error && <div className="alert alert--error">⚠️ {error}</div>}

          {!all ? (
            <LoadingSpinner label="Loading internships…" />
          ) : results.length === 0 ? (
            <EmptyState
              icon="🔎"
              title="No internships match your search"
              message="Try a different keyword or clear the filters."
            />
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                Showing {results.length} of {total} internships
              </p>
              <div className="content-grid content-grid--3">
                {results.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
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
