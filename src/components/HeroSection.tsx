import { ArrowRight } from 'lucide-react';
import { images } from '../data/site';
export default function HeroSection() {
  return <section id="home" className="hero-section"><img className="hero-image" src={images.hero} alt="Makkah and the Grand Mosque" fetchPriority="high"/><div className="hero-shade"/><div className="page-shell hero-content"><div className="hero-copy"><h1>Your Trusted Umrah<br/>Travel Companion</h1><p>From Karachi to the holy cities, a journey planned with care.</p><a className="button button-primary hero-button" href="#packages">Explore our Umrah Packages <ArrowRight size={18}/></a></div></div></section>;
}
