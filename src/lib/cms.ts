import { z } from 'zod';
import { tiers } from '../data/packages';
export const safeImage = (value: string) => /^\/(?!\/)[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value);
export function youtubeId(input: string): string | null {
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
const optionalDate = z.string().refine(value => value === '' || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value), 'Use a valid date.').default('');
export const packageSchema = z.object({
  name: z.string().trim().min(3).max(100), tier: z.enum(tiers as [string, ...string[]]),
  stars: z.number().int().min(1).max(5), nights: z.number().int().min(1).max(60),
  makkahNights: z.number().int().min(0).max(60), madinahNights: z.number().int().min(0).max(60),
  price: z.number().finite().positive().max(100000000), currency: z.enum(['USD', 'PKR', 'SAR']),
  image: z.string().max(2000).refine(safeImage, 'Use an HTTPS image URL or a local /image path.'), imageAlt: z.string().trim().min(3).max(200),
  badge: z.string().trim().max(50), months: z.array(z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)).min(1).max(36),
  type: z.enum(['Private', 'Group', 'Family']), description: z.string().trim().min(20).max(3000),
  includes: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  published: z.boolean(), isDemo: z.boolean(), departureDate: optionalDate, returnDate: optionalDate,
  makkahHotel: z.string().trim().max(150).default(''), madinahHotel: z.string().trim().max(150).default(''),
}).superRefine((value, ctx) => {
  if (value.nights !== value.makkahNights + value.madinahNights) ctx.addIssue({ code: 'custom', path: ['nights'], message: 'Total nights must equal Makkah + Madinah nights.' });
  if (!!value.departureDate !== !!value.returnDate) ctx.addIssue({ code: 'custom', path: ['returnDate'], message: 'Enter both departure and return dates, or leave both blank.' });
  if (value.departureDate && value.returnDate && value.returnDate <= value.departureDate) ctx.addIssue({ code: 'custom', path: ['returnDate'], message: 'Return must be after departure.' });
  if (value.departureDate && !value.months.includes(value.departureDate.slice(0, 7))) ctx.addIssue({ code: 'custom', path: ['months'], message: 'Include the departure month in available months.' });
});
export const settingsSchema = z.object({
  googlePlaceId: z.string().trim().max(300).regex(/^[A-Za-z0-9_-]*$/, 'Enter a Google Place ID, not a Maps URL.'),
  youtubeChannelUrl: z.string().trim().refine(value => !value || /^https:\/\/(www\.)?youtube\.com\/(?:@[\w.-]+|channel\/[\w-]+|c\/[\w.-]+)\/?$/.test(value), 'Use an HTTPS YouTube channel URL.'),
  shorts: z.array(z.object({ id: z.string().min(1).max(100), title: z.string().trim().min(3).max(100), videoId: z.string().regex(/^[\w-]{11}$/, 'Use a valid YouTube video ID.') })).max(12),
});
export function friendlyError(error: unknown) {
  const code = (error as { code?: string })?.code || '';
  if (code.includes('permission-denied')) return 'Access denied. Check your admin role and the deployed Firestore rules.';
  if (code.includes('unavailable') || code.includes('network-request-failed')) return 'Cannot connect right now. Check your connection and try again.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait before trying again.';
  return 'The operation could not be completed. Please try again or check your Firebase configuration.';
}
