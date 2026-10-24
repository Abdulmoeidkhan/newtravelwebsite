import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { contact, serviceOptions, whatsappUrl } from '../data/site';
import { formatInquiry, inquirySchema } from '../lib/inquiry';
import type { InquiryFormData, ServiceSelection } from '../types';
export interface InquiryPreset { service: ServiceSelection; message?: string; key: number; }
export default function InquiryFormSection({ preset }: { preset: InquiryPreset }) {
  const [ready, setReady] = useState<InquiryFormData | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InquiryFormData>({ resolver: zodResolver(inquirySchema), defaultValues: { name: '', email: '', phone: '', service: 'Custom Umrah', message: '' } });
  useEffect(() => { setValue('service', preset.service); if (preset.message !== undefined) setValue('message', preset.message); setReady(null); }, [preset, setValue]);
  return <section className="inquiry-section" id="inquiry"><div className="page-shell"><h2>Let’s plan your next journey</h2><div className="inquiry-form"><form noValidate onSubmit={handleSubmit(data => setReady(data))} onChange={() => { if (ready) setReady(null); }}>
    <div className="quote-fields">{([{ name: 'name', label: 'Full name', placeholder: 'Your name', type: 'text', autoComplete: 'name' }, { name: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', autoComplete: 'email' }, { name: 'phone', label: 'Phone number', placeholder: '+92 300 1234567', type: 'tel', autoComplete: 'tel' }] as const).map(field => <label key={field.name}>{field.label}<span className="required"> *</span><input {...register(field.name)} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? field.name + '-error' : undefined}/>{errors[field.name] && <span id={field.name + '-error'} className="form-error">{errors[field.name]?.message}</span>}</label>)}
    <label>Service<span className="required"> *</span><select {...register('service')} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined}>{serviceOptions.map(service => <option key={service}>{service}</option>)}</select>{errors.service && <span id="service-error" className="form-error">Choose a service.</span>}</label>
    <label>Journey details<span className="required"> *</span><textarea {...register('message')} rows={1} placeholder="Dates, travellers, preferences…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <span id="message-error" className="form-error">{errors.message.message}</span>}</label></div>
    <button type="submit" className="button quote-submit">Prepare my quote request <ArrowRight size={18}/></button><p className="form-privacy">Your details stay in this browser until you choose to send them by WhatsApp or email.</p></form>
    {ready && <div className="inquiry-ready" role="status"><h3><CheckCircle2 size={20}/> Your request is ready to send</h3><p>Choose how to send it to our team. Nothing has been submitted yet.</p><div className="flex flex-wrap gap-3"><a className="button button-primary" href={whatsappUrl(formatInquiry(ready))} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Send via WhatsApp</a><a className="button button-outline" href={`mailto:${contact.email}?subject=${encodeURIComponent('Rihla quote request — ' + ready.service)}&body=${encodeURIComponent(formatInquiry(ready))}`}><Mail size={18}/> Open email draft</a></div></div>}
    </div></div></section>;
}
