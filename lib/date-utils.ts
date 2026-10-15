const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Deterministic full date formatter (e.g. "Oct 6, 2026") that matches identically
 * between Server-Side Rendering (SSR) and Client Hydration.
 */
export function formatFullDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Deterministic short date formatter (e.g. "Oct 6") safe for SSR and Client.
 */
export function formatShortDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/**
 * Relative time formatter (e.g. "1 min ago", "12m ago", "2h ago", "1d ago").
 */
export function formatRelativeTime(dateStr?: string | Date | null): string {
  if (!dateStr) return '1 min ago';
  try {
    const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
    const mins = Math.floor(diff / 60000);
    if (mins <= 1) return '1 min ago';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return '1 min ago';
  }
}
