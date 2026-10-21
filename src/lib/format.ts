/**
 * Deterministic formatting utilities to prevent SSR / Client hydration mismatches
 * in Next.js App Router applications.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a date deterministically into "MMM D, YYYY" (e.g., "Oct 18, 2026")
 * using UTC date components so SSR HTML matches client DOM regardless of local browser timezone.
 */
export function formatDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  const year = d.getUTCFullYear();
  const month = MONTHS[d.getUTCMonth()];
  const day = d.getUTCDate();
  return `${month} ${day}, ${year}`;
}

/**
 * Formats a time deterministically into "HH:MM UTC" (e.g., "14:30 UTC")
 */
export function formatTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes} UTC`;
}

/**
 * Formats date and time into "MMM D, YYYY HH:MM UTC"
 */
export function formatDateTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  return `${formatDate(dateInput)} ${formatTime(dateInput)}`;
}
