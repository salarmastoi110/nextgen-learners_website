import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import InternshipCard from '../../components/cards/InternshipCard';
import { internshipService } from '../../services/internshipService';
import { useSearch } from '../../hooks/useSearch';
import { studentLinks } from './PortalDashboard';
import { INTERNSHIP_TYPES } from '../../utils/constants';

export default function BrowseInternships() {
  const [all, setAll] = useState(null);

  useEffect(() => {
    internshipService.getAll().then(setAll);
  }, []);

  const { term, setTerm, filters, setFilters, results } = useSearch(all || [], {
    searchFields: ['title', 'company', 'location', 'skills'],
    filterFn: (item, f) => !f.type || item.type === f.type,
    pageSize: 100,
  });

  return (
    <PortalLayout title="Browse Internships" links={studentLinks}>
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <SearchBar value={term} onChange={setTerm} placeholder="Search internships…" />
        </div>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={filters.type || ''}
          onChange={(e) => setFilters({ type: e.target.value || null })}
          aria-label="Filter by work type"
        >
          <option value="">All types</option>
          {INTERNSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {!all ? (
        <LoadingSpinner label="Loading internships…" />
      ) : results.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="Nothing matches"
          message="Try another keyword or clear the type filter."
        />
      ) : (
        <div className="content-grid content-grid--3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {results.map((internship) => (
            <div key={internship.id}>
              <InternshipCard internship={internship} />
              <Link
                to={`/apply/${internship.id}`}
                className="btn btn--primary btn--sm btn--block"
                style={{ marginTop: 'var(--space-3)' }}
              >
                Quick Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
