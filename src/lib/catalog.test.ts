import { describe, expect, it } from 'vitest';
import { packages } from '../data/packages';
import { karachiDate, upcomingPackages } from './catalog';
describe('upcoming catalogue', () => {
  it('uses the Karachi date at the UTC day boundary', () => {
    expect(karachiDate(new Date('2026-10-26T19:00:00Z'))).toBe('2026-10-27');
    expect(karachiDate(new Date('2026-10-26T18:59:59Z'))).toBe('2026-10-26');
  });
  it('hides departed trips even if their return date or availability month is in the future', () => {
    expect(upcomingPackages([{ ...packages[0], departureDate: '2026-10-26', returnDate: '2026-11-05' }], '2026-10-27')).toEqual([]);
  });
  it('keeps departures today and in the future, ordered by departure', () => {
    const items = ['2026-11-03', '2026-10-27'].map(departureDate => ({ ...packages[0], departureDate }));
    expect(upcomingPackages(items, '2026-10-27').map(item => item.departureDate)).toEqual(['2026-10-27', '2026-11-03']);
  });
  it('keeps flexible packages for the current month and removes expired months without mutating records', () => {
    const item = { ...packages[0], months: ['2026-09', '2026-10', '2026-11'] };
    expect(upcomingPackages([item], '2026-10-27')[0].months).toEqual(['2026-10', '2026-11']);
    expect(item.months).toEqual(['2026-09', '2026-10', '2026-11']);
    expect(upcomingPackages([item], '2026-12-01')).toEqual([]);
  });
});
