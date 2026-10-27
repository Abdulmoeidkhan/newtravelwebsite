import type { Package } from '../types';

export function karachiDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find(value => value.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

// Public visibility only: keep original records and publication flags intact for staff.
export function upcomingPackages(items: Package[], today = karachiDate()): Package[] {
  const month = today.slice(0, 7);
  return items.filter(item => item.departureDate ? item.departureDate >= today : item.months.some(value => value >= month))
    .map(item => ({ ...item, months: item.months.filter(value => value >= month) }))
    .sort((a, b) => (a.departureDate || '9999').localeCompare(b.departureDate || '9999') || a.name.localeCompare(b.name));
}
