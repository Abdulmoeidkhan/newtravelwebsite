import type { Review, Service } from '../types';
export const services: Service[] = [
  { id: 'stay', title: 'Stay closer to the sacred', description: 'Explore comfortable hotels close to the Haram, with room options to suit your family and your budget.', icon: 'hotel' },
  { id: 'flights', title: 'A smoother start to your journey', description: 'Let us help coordinate return flights and e-Visa requirements, with clear guidance before you depart.', icon: 'plane' },
  { id: 'transport', title: 'Every connection, considered', description: 'From your airport arrival to intercity transfers, plan comfortable ground transport for each step.', icon: 'car' },
  { id: 'ziyarah', title: 'Discover stories beyond the journey', description: 'Enrich your visit with guided Ziyarah in Makkah and Madinah, or ask about an Al Ula extension.', icon: 'compass' },
];
export const reviews: Review[] = [
  { id: '1', name: 'Family traveller', location: 'Karachi', text: 'Having our accommodation and transfers planned together would let us spend more time focusing on our ibadah and less time on the details.', rating: 5, trip: 'Family Umrah', verified: false, isDemo: true },
  { id: '2', name: 'First-time pilgrim', location: 'Lahore', text: 'For our first Umrah, clear guidance at every stage is what matters most. A thoughtful itinerary makes the whole journey feel more reassuring.', rating: 5, trip: 'First Umrah', verified: false, isDemo: true },
  { id: '3', name: 'Group traveller', location: 'Islamabad', text: 'Travelling together gives the experience a special meaning. We look for comfortable stays, time to reflect, and a pace that works for everyone.', rating: 5, trip: 'Group Umrah', verified: false, isDemo: true },
];
