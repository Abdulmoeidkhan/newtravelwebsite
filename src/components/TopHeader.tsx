import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { contact, whatsappUrl } from '../data/site';
export default function TopHeader() {
  return <div className="top-header"><div className="page-shell top-header-inner"><div><a href={`tel:${contact.tel}`}><Phone size={15}/>{contact.phone}</a><a href={contact.map} target="_blank" rel="noreferrer"><MapPin size={15}/>Visit our office</a></div><div className="top-header-right"><a href={`mailto:${contact.email}`}><Mail size={15}/>Email us</a><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={15}/>WhatsApp</a></div></div></div>;
}
