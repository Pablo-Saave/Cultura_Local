const Icon = ({ children }) => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export function matchesAdminDate(value, range) {
  if (!range || range === 'all' || !value) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  if (range === 'quarter') return date >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  if (range === 'year') return date.getFullYear() === now.getFullYear();
  return true;
}

function AdminListFilters({
  search, onSearchChange, category, onCategoryChange, categories = [],
  dateRange, onDateRangeChange, status, onStatusChange, statuses = [],
  searchPlaceholder = 'Buscar por título o descripción...'
}) {
  const controlClass = 'h-11 rounded-full border border-primary/15 bg-white/80 px-4 text-sm font-medium text-primary-dark shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_auto_auto_auto]">
      <label className={`flex min-w-0 items-center gap-3 ${controlClass}`}>
        <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
        <input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-primary-dark/65" type="search" value={search} onChange={event => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
      </label>

      <label className={`flex items-center gap-3 ${controlClass}`}>
        <Icon><path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5z" /></Icon>
        <select className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent outline-none" value={category} onChange={event => onCategoryChange(event.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <span aria-hidden="true">⌄</span>
      </label>

      <label className={`flex items-center gap-3 ${controlClass}`}>
        <Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Icon>
        <select className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent outline-none" value={dateRange} onChange={event => onDateRangeChange(event.target.value)}>
          <option value="all">Todas las fechas</option>
          <option value="month">Este mes</option>
          <option value="quarter">Últimos 3 meses</option>
          <option value="year">Este año</option>
        </select>
        <span aria-hidden="true">⌄</span>
      </label>

      <label className={`flex items-center gap-3 ${controlClass}`}>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
        <select className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent outline-none" value={status} onChange={event => onStatusChange(event.target.value)}>
          <option value="all">Todos</option>
          {statuses.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span aria-hidden="true">⌄</span>
      </label>
    </div>
  );
}

export default AdminListFilters;
