export type PartialDate = number | string;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function yearOf(d: PartialDate): number {
  return typeof d === 'number' ? d : Number(d.slice(0, 4));
}

export function formatPartialDate(d: PartialDate): string {
  if (typeof d === 'number') return String(d);
  const [year, month, day] = d.split('-');
  const monthName = MONTHS[Number(month) - 1];
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

export function formatPeriod(start?: PartialDate, end?: PartialDate | 'present'): string {
  if (start === undefined && end === undefined) return '';
  if (start === undefined) return end === 'present' ? 'present' : formatPartialDate(end!);
  const from = formatPartialDate(start);
  if (end === undefined) return from;
  const to = end === 'present' ? 'present' : formatPartialDate(end);
  return from === to ? from : `${from} – ${to}`;
}

export function decadeOf(d: PartialDate): string {
  return `${Math.floor(yearOf(d) / 10) * 10}s`;
}

export function sortKey(d: PartialDate): string {
  if (typeof d === 'number') return `${d}-00-00`;
  return d.length === 7 ? `${d}-00` : d;
}
