import NextLink from 'next/link';
import { type ReactNode, useMemo, useState } from 'react';
import { formatDates, localize } from '@/lib/events';
import {
  applyFilters,
  type Availability,
  DEFAULT_FILTERS,
  type Filters,
  instructorOptions,
  type SortKey,
  termOptions,
  type WorkshopSummary,
} from '@/lib/workshops';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'dateAsc', label: 'Date, soonest first' },
  { value: 'dateDesc', label: 'Date, latest first' },
  { value: 'priceAsc', label: 'Price, low to high' },
  { value: 'priceDesc', label: 'Price, high to low' },
  { value: 'instructor', label: 'Instructor, A–Z by last name' },
];

const AVAILABILITY: { value: Availability; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Not sold out' },
  { value: 'soldOut', label: 'Sold out' },
];

/** A grey box standing in for an image until real ones are wired in. */
const Placeholder = ({ label }: { label: string }) => (
  <div
    role="img"
    aria-label={label}
    style={{
      aspectRatio: '4 / 3',
      background: '#ddd',
      color: '#777',
      display: 'grid',
      placeItems: 'center',
      fontSize: 14,
    }}
  >
    400 × 300
  </div>
);

function Select({
  label,
  value,
  onChange,
  options,
  all,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  all?: string;
}): ReactNode {
  return (
    <label style={{ display: 'grid', gap: 2 }}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {all !== undefined && <option value="">{all}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const names = (workshop: WorkshopSummary) =>
  workshop.instructors?.map((person) => person.title).filter(Boolean).join(', ') ?? '';
const price = (workshop: WorkshopSummary) => (workshop.price == null ? '' : `$${workshop.price}`);
const status = (workshop: WorkshopSummary) => (workshop.status === 'soldOut' ? 'Sold out' : '');

/**
 * The workshop listing: filters on instructor, type, material and availability, sorting by date, price or
 * instructor, and a grid or compact list view. Unstyled apart from layout.
 *
 * @param props - the workshops and today's date.
 * @returns the listing.
 */
export function WorkshopBrowser({ workshops, today }: { workshops: WorkshopSummary[]; today: string }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((old) => ({ ...old, [key]: value }));

  const instructors = useMemo(() => instructorOptions(workshops), [workshops]);
  const types = useMemo(() => termOptions(workshops, 'workshopTypes'), [workshops]);
  const materials = useMemo(() => termOptions(workshops, 'materials'), [workshops]);
  const shown = useMemo(() => applyFilters(workshops, filters, today), [workshops, filters, today]);
  const filtered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div>
      <form
        onSubmit={(event) => event.preventDefault()}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end', margin: '16px 0' }}
      >
        <Select label="Instructor" value={filters.instructor} onChange={(v) => set('instructor', v)} options={instructors} all="All" />
        <Select label="Type" value={filters.type} onChange={(v) => set('type', v)} options={types} all="All" />
        <Select label="Material" value={filters.material} onChange={(v) => set('material', v)} options={materials} all="All" />
        <Select
          label="Availability"
          value={filters.availability}
          onChange={(v) => set('availability', v as Availability)}
          options={AVAILABILITY}
        />
        <Select label="Sort" value={filters.sort} onChange={(v) => set('sort', v as SortKey)} options={SORTS} />
        <label>
          <input type="checkbox" checked={filters.includePast} onChange={(e) => set('includePast', e.target.checked)} /> Include past
        </label>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', gap: 8 }}>
          <legend style={{ position: 'absolute', left: -9999 }}>View</legend>
          {(['grid', 'list'] as const).map((mode) => (
            <label key={mode}>
              <input type="radio" name="view" checked={view === mode} onChange={() => setView(mode)} />{' '}
              {mode === 'grid' ? 'Grid' : 'List'}
            </label>
          ))}
        </fieldset>
        {filtered && (
          <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Reset
          </button>
        )}
      </form>

      <p aria-live="polite">
        {shown.length} of {workshops.length} workshops
      </p>
      {shown.length === 0 && <p>No workshops match.</p>}

      {view === 'grid' ? (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          }}
        >
          {shown.map((workshop) => (
            <li key={workshop._id}>
              <NextLink href={`/workshops/${workshop.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <Placeholder label={localize(workshop.title)} />
                <strong style={{ display: 'block', marginTop: 8 }}>{localize(workshop.title)}</strong>
              </NextLink>
              <div>{formatDates(workshop)}</div>
              <div>{names(workshop)}</div>
              <div>{[price(workshop), status(workshop)].filter(Boolean).join(' · ')}</div>
            </li>
          ))}
        </ul>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Workshop</th>
              <th>Dates</th>
              <th>Instructor</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((workshop) => (
              <tr key={workshop._id} style={{ borderTop: '1px solid #ccc' }}>
                <td>
                  <NextLink href={`/workshops/${workshop.slug}`}>{localize(workshop.title)}</NextLink>
                </td>
                <td>{formatDates(workshop)}</td>
                <td>{names(workshop)}</td>
                <td>{price(workshop)}</td>
                <td>{status(workshop)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
