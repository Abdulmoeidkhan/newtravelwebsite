export type PackageTier = 'Platinum 5 Star' | 'Gold 5 Star' | 'Silver 4 Star' | 'Special Programs';
export type ServiceSelection = 'Custom Umrah' | 'Hajj 2027' | 'Group Umrah' | 'Flights' | 'Visa' | 'Halal Tours';
export interface Package { id: string; name: string; tier: PackageTier; stars: number; nights: number; makkahNights: number; madinahNights: number; price: number; currency: 'USD' | 'PKR' | 'SAR'; image: string; imageAlt: string; badge: string; months: string[]; type: 'Private' | 'Group' | 'Family'; description: string; includes: string[]; published?: boolean; isDemo?: boolean; departureDate?: string; returnDate?: string; makkahHotel?: string; madinahHotel?: string; }
export interface Service { id: string; title: string; description: string; icon: 'hotel' | 'plane' | 'car' | 'compass'; }
export interface Review { id: string; name: string; location: string; text: string; rating: number; trip: string; verified: boolean; isDemo: boolean; }
export interface InquiryFormData { name: string; email: string; phone: string; service: ServiceSelection; message: string; }
export interface PackageFilters { month: string; tier: string; type: string; }
export interface ShortVideo { id: string; title: string; videoId: string; }
export interface SiteSettings { googlePlaceId: string; youtubeChannelUrl: string; shorts: ShortVideo[]; }
export interface GoogleReview { name: string; author: string; authorUrl: string; photoUrl: string; text: string; rating: number; date: string; sourceUrl: string; }
export interface GoogleReviewsResponse { name: string; rating: number | null; count: number; mapsUrl: string; reviews: GoogleReview[]; attributions: { provider: string; uri: string }[]; }
