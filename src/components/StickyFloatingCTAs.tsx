import { useState } from 'react';
import { ArrowUpRight, MessageCircle, Plus, X } from 'lucide-react';
import { whatsappUrl } from '../data/site';
import type { ServiceSelection } from '../types';
export default function StickyFloatingCTAs({ onInquiry }: { onInquiry: (service?: ServiceSelection) => void }) {
  const [open, setOpen] = useState(false);
  return <aside className="floating-ctas" aria-label="Quick contact">{open && <div className="quick-actions" id="quick-actions"><button onClick={() => { onInquiry('Custom Umrah'); setOpen(false); }}>Custom Umrah Request <ArrowUpRight size={15}/></button><button onClick={() => { onInquiry('Hajj 2027'); setOpen(false); }}>Hajj 2027 Pre-Register <ArrowUpRight size={15}/></button></div>}<div className="flex items-center justify-end gap-2"><button className="quick-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close quick actions' : 'Open quick actions'} aria-expanded={open} aria-controls="quick-actions">{open ? <X size={19}/> : <Plus size={19}/>}</button><a className="whatsapp-button" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={21}/><span>Let’s talk</span></a></div></aside>;
}
