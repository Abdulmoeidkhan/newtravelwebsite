import * as Tabs from '@radix-ui/react-tabs';
import { Check, ChevronDown } from 'lucide-react';
import { images } from '../data/site';
const services = [
  { id: 'accommodations', label: 'Hotels', title: 'Accommodation in the holy cities', text: 'Choose a stay around your family’s needs, preferred location and budget. Your hotel and room arrangements are confirmed in your quote.', points: ['Makkah and Madinah hotel options', 'Family and shared-room preferences', 'Meal plans and location confirmed before booking'], action: 'Ask about hotel options', photo: images.madinah, second: images.makkah },
  { id: 'flights-visa', label: 'Flights & Visa', title: 'Flight and visa planning', text: 'Speak with our team about your departure city, travel dates and visa requirements, with the arrangements clearly listed in your quote.', points: ['Flight options for your dates', 'Visa application guidance', 'Arrival and departure coordination'], action: 'Discuss flights and visas', photo: images.hero, second: images.madinah },
  { id: 'transportation', label: 'Ground Transportation', title: 'Travel comfortably between destinations', text: 'Plan the transfers that connect your journey, from arriving at the airport to travelling between Makkah and Madinah.', points: ['Airport pickup and drop-off options', 'Intercity transfers', 'Vehicle arrangements for your group'], action: 'Plan your transfers', photo: images.makkah, second: images.hero },
  { id: 'ziyarah', label: 'Guided Ziyarahs', title: 'Make time for discovery and reflection', text: 'Discuss visits to meaningful places in Makkah and Madinah. Our team can help you explore options suited to your schedule and pace.', points: ['Makkah and Madinah visit options', 'An itinerary suited to your group', 'Guide and transport availability confirmed by quote'], action: 'Explore Ziyarah options', photo: images.madinah, second: images.makkah },
];
export default function ServicesGrid() {
  return <section className="services-section" id="services"><div className="page-shell"><h2>Explore our Umrah Services</h2><Tabs.Root defaultValue="accommodations" className="service-tabs">
    <Tabs.List aria-label="Umrah services" className="service-tab-list">{services.map(service => <Tabs.Trigger key={service.id} value={service.id}>{service.label}<ChevronDown size={15}/></Tabs.Trigger>)}</Tabs.List>
    {services.map(service => <Tabs.Content key={service.id} value={service.id} className="service-tab-panel"><div className="service-description" id={service.id}><h3>{service.title}</h3><p>{service.text}</p><ul>{service.points.map(point => <li key={point}><Check size={17}/>{point}</li>)}</ul><a className="button button-primary" href="#inquiry">{service.action}</a></div><div className="service-images"><img src={service.photo} alt="Pilgrimage landmarks in Saudi Arabia" loading="lazy"/><img src={service.second} alt="The holy cities of Makkah and Madinah" loading="lazy"/></div></Tabs.Content>)}
    </Tabs.Root></div></section>;
}
