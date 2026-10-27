import { useMemo, useState } from 'react';

/**
 * Client-side search + filter + pagination over an array.
 *
 * useSearch(items, {
 *   searchFields: ['title', 'company'],
 *   filterFn: (item, filters) => ...,
 *   pageSize: 6,
 * })
 */
export const useSearch = (items, options = {}) => {
  const { searchFields = [], filterFn, pageSize = 9 } = options;

  const [term, setTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = term.toLowerCase().trim();
    let result = items;

    if (filterFn && Object.values(filters).some(Boolean)) {
      result = result.filter((item) => filterFn(item, filters));
    }

    if (q) {
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          const text = Array.isArray(value) ? value.join(' ') : String(value ?? '');
          return text.toLowerCase().includes(q);
        })
      );
    }
    return result;
  }, [items, term, filters, searchFields, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const updateTerm = (value) => {
    setTerm(value);
    setPage(1);
  };

  const updateFilters = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  };

  return {
    term,
    setTerm: updateTerm,
    filters,
    setFilters: updateFilters,
    page: safePage,
    setPage,
    results: paged,
    total: filtered.length,
    totalPages,
  };
};
