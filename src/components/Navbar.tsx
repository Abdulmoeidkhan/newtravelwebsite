import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Menu, X } from 'lucide-react';
import Brand from './Brand';
import type { ServiceSelection } from '../types';
const links = [['Special Packages', '#special-packages'], ['Hajj 2027', '#hajj'], ['Testimonials', '#testimonials'], ['Contact Us', '#inquiry']];
const categories = ['Platinum 5 Star', 'Gold 5 Star', 'Silver 4 Star'];
export default function Navbar({ onTier, onInquiry }: { onTier: (tier: string) => void; onInquiry: (service?: ServiceSelection) => void }) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const tierLinks = categories.map(tier => <a key={tier} href="#packages" onClick={() => { onTier(tier); setOpen(false); setDropdown(false); }}>{tier} Umrah</a>);
  const navigation = links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>);
  return <header className="navbar"><div className="page-shell flex h-full items-center justify-between gap-5"><Brand/>
    <nav aria-label="Main navigation" className="desktop-nav"><a href="#home">Home</a><div className="nav-dropdown" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropdown(false); }} onKeyDown={event => { if (event.key === 'Escape') { setDropdown(false); event.currentTarget.querySelector('button')?.focus(); } }}>
    <button aria-expanded={dropdown} aria-controls="umrah-navigation" onClick={() => setDropdown(!dropdown)}>Umrah <ChevronDown size={15}/></button>{dropdown && <div id="umrah-navigation" className="nav-dropdown-menu"><a href="#packages" onClick={() => { onTier(''); setDropdown(false); }}>All Umrah packages</a>{tierLinks}</div>}</div>{navigation}</nav>
    <button className="button nav-quote" onClick={() => onInquiry()}>Request a Quote</button>
    <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><button className="mobile-menu icon-button" aria-label="Open navigation"><Menu/></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="mobile-navigation"><Dialog.Title className="sr-only">Navigation</Dialog.Title><Dialog.Description className="sr-only">Explore Rihla packages and plan your journey.</Dialog.Description><div className="flex items-center justify-between"><Brand/><Dialog.Close className="icon-button" aria-label="Close navigation"><X/></Dialog.Close></div><nav aria-label="Mobile navigation"><a href="#home" onClick={() => setOpen(false)}>Home</a><a href="#packages" onClick={() => { onTier(''); setOpen(false); }}>All Umrah packages</a>{tierLinks}{navigation}</nav><button className="button button-primary" onClick={() => { setOpen(false); onInquiry(); }}>Request a Quote</button></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div></header>;
}
