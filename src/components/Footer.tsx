import { useState } from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import Brand from './Brand';
import SitePolicies from './SitePolicies';
import { contact, whatsappUrl } from '../data/site';
export default function Footer() {
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  return <footer className="footer"><div className="page-shell footer-grid">
    <div><Brand light/><p className="footer-about">Your Karachi team for thoughtfully planned Umrah, Hajj inquiries and meaningful journeys. Speak with us about the itinerary that’s right for you.</p><span className="footer-signature">Your journey. Our amanah.</span></div>
    <div><h3>Contact Us</h3><a className="footer-contact" href={`tel:${contact.tel}`}><Phone size={17}/>{contact.phone}</a><a className="footer-contact" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={17}/>Chat on WhatsApp</a><a className="footer-contact" href={`mailto:${contact.email}`}><Mail size={17}/>{contact.email}</a><a className="footer-contact" href={contact.map} target="_blank" rel="noreferrer"><MapPin size={18}/><span>{contact.address}</span></a></div>
    <div><h3>Quick Links</h3><a href="#about">About Rihla</a><a href="#packages">Umrah Packages</a><a href="#special-packages">Special Packages</a><a href="#testimonials">Testimonials</a><a href="#hajj">Hajj 2027</a><a href="#inquiry">Custom Umrah</a></div>
    <div><h3>Plan with Rihla</h3><a href="#services">Accommodation</a><a href="#services">Flights & Visa</a><a href="#services">Transportation</a><a href="#services">Guided Ziyarahs</a><a href="#faq">Travel Questions</a><a href="/admin">Staff Sign In</a></div>
  </div><div className="newsletter-band"><div className="page-shell newsletter-layout"><h3>Subscribe to our newsletter</h3><form className="newsletter-form" onSubmit={event => { event.preventDefault(); setReady(true); }}><label className="sr-only" htmlFor="newsletter-email">Email for journey updates</label><input id="newsletter-email" type="email" required maxLength={254} placeholder="Email address" value={email} onChange={event => { setEmail(event.target.value); setReady(false); }}/><button type="submit">Continue</button></form><a className="newsletter-contact" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={20}/>Stay in touch</a>
    {ready && <p className="newsletter-ready" role="status"><a href={`mailto:${contact.email}?subject=Journey%20updates%20subscription%20request&body=${encodeURIComponent('Please add ' + email + ' to your journey updates. I consent to receive emails and understand I can ask to unsubscribe.')}`}>Send your subscription request by email →</a><span>You are not subscribed until the team confirms.</span></p>}
  </div></div><div className="footer-base"><div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} Rihla Travel and Tours. All rights reserved.</span><SitePolicies/></div></div></footer>;
}
