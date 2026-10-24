import { describe, expect, it } from 'vitest';
import { filterPackages, packages } from '../data/packages';
import { formatInquiry, inquirySchema } from './inquiry';
import { whatsappUrl } from '../data/site';

describe('package discovery', () => {
  it('combines departure, tier and party filters', () => {
    expect(filterPackages(packages, { month: '2026-12', tier: 'Gold 5 Star', type: 'Group' }).map(item => item.id)).toEqual(['gold']);
  });
  it('returns an empty result for conflicting filters', () => {
    expect(filterPackages(packages, { month: '2027-03', tier: 'Platinum 5 Star', type: '' })).toEqual([]);
  });
  it('restores the full inventory when filters are cleared', () => {
    expect(filterPackages(packages, { month: '', tier: '', type: '' })).toHaveLength(4);
  });
});
describe('inquiry validation and handoff', () => {
  const valid = { name: '  Ali Ahmed  ', email: 'ali@example.com', phone: '+92 335 3819460', service: 'Custom Umrah', message: 'Two adults travelling in December.' };
  it('trims contact details and accepts an international phone number', () => {
    expect(inquirySchema.parse(valid).name).toBe('Ali Ahmed');
  });
  it.each([{ email: 'invalid' }, { phone: '123' }, { phone: 'abcdefg1234567' }, { service: 'Unknown' }, { message: 'short' }, { name: ' ' }])('rejects invalid data %j', changes => {
    expect(inquirySchema.safeParse({ ...valid, ...changes }).success).toBe(false);
  });
  it('preserves message content and targets the official WhatsApp number', () => {
    const data = inquirySchema.parse({ ...valid, message: 'Family & friends + children? Dates: December.' });
    const url = new URL(whatsappUrl(formatInquiry(data)));
    expect(url.pathname).toBe('/923353819460');
    expect(url.searchParams.get('text')).toContain(data.message);
    expect(url.searchParams.get('text')).toContain('Service: Custom Umrah');
  });
});
