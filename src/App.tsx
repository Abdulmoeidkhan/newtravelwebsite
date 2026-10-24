import { lazy, Suspense, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Compass, Hotel, Plane, Users } from 'lucide-react';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PackageCardGrid from './components/PackageCardGrid';
import ServicesGrid from './components/ServicesGrid';
import GoogleReviews from './components/GoogleReviews';
import YouTubeShorts from './components/YouTubeShorts';
import { HajjSection, SpecialPackages, WhyRihla } from './components/JourneySections';
import { useCatalog } from './hooks/useCatalog';
import { useSiteSettings } from './hooks/useSiteSettings';
import InquiryFormSection, { type InquiryPreset } from './components/InquiryFormSection';
import Footer from './components/Footer';
import StickyFloatingCTAs from './components/StickyFloatingCTAs';
import type { Package, PackageFilters, ServiceSelection } from './types';
const Admin = lazy(() => import('./pages/Admin'));
export default function App() {
  if (/^\/admin(?:\/|$)/.test(window.location.pathname)) return <Suspense fallback={<main className="admin-login" role="status">Loading admin workspace…</main>}><Admin/></Suspense>;
  return <PublicSite/>;
}
function PublicSite() {
  const catalog = useCatalog();
  const settings = useSiteSettings();
  const [filters, setFilters] = useState<PackageFilters>({ month: '', tier: '', type: '' });
  const [preset, setPreset] = useState<InquiryPreset>({ service: 'Custom Umrah', key: 0 });
  const inquire = (service: ServiceSelection = 'Custom Umrah', message?: string) => {
    setPreset({ service, message: message ?? (service === 'Hajj 2027' ? 'I would like information about Hajj 2027. Please contact me about available options and next steps.' : ''), key: Date.now() });
    document.getElementById('inquiry')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const selectPackage = (item: Package) => inquire(item.type === 'Group' ? 'Group Umrah' : 'Custom Umrah', `I’m interested in ${item.name} (${item.nights} nights, ${item.tier}). Please share availability and a personalized quote.`);
  return <MotionConfig reducedMotion="user"><div className="public-site"><a className="skip-link" href="#main">Skip to content</a><TopHeader/><Navbar onTier={tier => setFilters({ month: '', type: '', tier })} onInquiry={inquire}/><main id="main">
    <HeroSection/><div className="journey-strip"><div className="page-shell">{[{ icon: Hotel, title: 'Makkah & Madinah stays' }, { icon: Plane, title: 'Flights & visa guidance' }, { icon: Users, title: 'Family & group journeys' }, { icon: Compass, title: 'Personal itinerary planning' }].map(({ icon: Icon, title }) => <a href="#services" key={title}><Icon size={30}/><span>{title}</span></a>)}</div></div>
    <PackageCardGrid items={catalog.items} loading={catalog.loading} error={catalog.error} filters={filters} onFilters={setFilters} onSelect={selectPackage}/>
    <ServicesGrid/><SpecialPackages items={catalog.items} onSelect={selectPackage} onInquiry={inquire}/>
    <div className="testimonials-band"><GoogleReviews placeId={settings.googlePlaceId}/>{(settings.shorts.length > 0 || settings.youtubeChannelUrl) && <YouTubeShorts settings={settings}/>}</div>
    <HajjSection onInquiry={inquire}/><WhyRihla/><InquiryFormSection preset={preset}/>
  </main><Footer/><StickyFloatingCTAs onInquiry={inquire}/></div></MotionConfig>;
}
