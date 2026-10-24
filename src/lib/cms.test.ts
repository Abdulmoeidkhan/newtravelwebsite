import { describe, expect, it } from 'vitest';
import { packageSchema, safeImage, settingsSchema, youtubeId } from './cms';
import { availableMonths, packages } from '../data/packages';
const valid = { ...packages[0], published: false, isDemo: true };
describe('package administration', () => {
  it('accepts complete drafts and preserves publish state', () => { expect(packageSchema.parse(valid).published).toBe(false); });
  it.each([{ price: -1 }, { stars: 6 }, { nights: 9 }, { currency: 'XXX' }, { months: ['2027-13'] }, { image: 'javascript:alert(1)' }, { published: 'true' }, { includes: [] }, { departureDate: '2026-11-12', returnDate: '2026-11-01' }, { departureDate: '2027-02-30', returnDate: '2027-03-10' }])('rejects invalid package data %j', changes => { expect(packageSchema.safeParse({ ...valid, ...changes }).success).toBe(false); });
  it('derives sorted month choices from real inventory', () => { expect(availableMonths([packages[0]])[0]).toEqual({ value: '2026-11', label: 'November 2026' }); expect(availableMonths([])).toEqual([]); });
  it('requires departure and availability months to agree', () => { expect(packageSchema.safeParse({ ...valid, departureDate: '2028-01-01', returnDate: '2028-01-11' }).success).toBe(false); });
});
describe('media validation', () => {
  it.each(['https://www.youtube.com/shorts/abcdefghijk', 'https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'abcdefghijk'])('extracts a safe video ID from %s', value => expect(youtubeId(value)).toBe('abcdefghijk'));
  it.each(['https://youtube.com.evil.test/shorts/abcdefghijk', 'javascript:alert(1)', 'http://youtube.com/shorts/abcdefghijk', '<iframe/>'])('rejects untrusted video input %s', value => expect(youtubeId(value)).toBeNull());
  it('rejects iframe HTML and arbitrary channel domains', () => { expect(settingsSchema.safeParse({ googlePlaceId: '', youtubeChannelUrl: 'https://evil.test', shorts: [] }).success).toBe(false); });
  it('rejects protocol-relative image paths', () => { expect(safeImage('//evil.test/image')).toBe(false); expect(safeImage('/makkah.jpg')).toBe(true); });
});
