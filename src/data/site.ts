export const contact = {
  phone: '+92 335 3819460', tel: '+923353819460', email: 'info@rihlatravelandtours.com',
  address: 'Shop no 25, Shamim Sky Tower, Gulshan e Shamim, Karachi',
  map: 'https://share.google/sEyrPrHvbYvObdthf',
};
export const whatsappUrl = (message = 'Assalamu Alaikum! I would like to plan my journey with Rihla.') => `https://wa.me/923353819460?text=${encodeURIComponent(message)}`;
export const images = {
  hero: '/hero.jpg',
  makkah: '/makkah.jpg',
  madinah: '/madinah.jpg',
};
export const months = [ { value: '2026-11', label: 'November 2026' }, { value: '2026-12', label: 'December 2026' }, { value: '2027-01', label: 'January 2027' }, { value: '2027-02', label: 'February 2027' }, { value: '2027-03', label: 'March 2027' } ];
export const serviceOptions = ['Custom Umrah', 'Hajj 2027', 'Group Umrah', 'Flights', 'Visa', 'Halal Tours'] as const;
