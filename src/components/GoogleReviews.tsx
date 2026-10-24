import { useEffect, useRef, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { ArrowUpRight } from 'lucide-react';
import GoogleReviewStrip from './GoogleReviewStrip';
import { cloudFunctions } from '../lib/firebase';
import { contact } from '../data/site';
import type { GoogleReviewsResponse } from '../types';
export default function GoogleReviews({ placeId }: { placeId: string }) {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null); const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const section = useRef<HTMLElement>(null); const [retry, setRetry] = useState(0);
  useEffect(() => {
    setData(null); setState('idle'); if (!placeId) return; if (!cloudFunctions) { setState('error'); return; }
    let active = true; let started = false;
    async function load() {
      if (started) return; started = true; setState('loading');
      try { const result = await httpsCallable<void, GoogleReviewsResponse>(cloudFunctions!, 'getGoogleReviews')(); if (active) { setData(result.data); setState('ready'); } }
      catch { if (active) setState('error'); }
    }
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void load(); } }, { rootMargin: '100px' });
    if (section.current) observer.observe(section.current);
    return () => { active = false; observer.disconnect(); };
  }, [placeId, retry]);
  const mapsUrl = data?.mapsUrl || (placeId ? `https://www.google.com/maps/search/?api=1&query=Rihla&query_place_id=${encodeURIComponent(placeId)}` : contact.map);
  return <section ref={section} id="testimonials" className="section page-shell"><div className="section-heading"><div><p className="eyebrow text-ocean-600">FROM OUR TRAVELLERS</p><h2>Stories from our Travellers</h2></div><a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">See reviews on Google Maps <ArrowUpRight size={16}/></a></div>
    <GoogleReviewStrip data={data} mapsUrl={mapsUrl} loading={state === 'loading' || (state === 'idle' && !!placeId)} unavailable={state === 'error'} onRetry={() => setRetry(value => value + 1)}/>
    {data && <div className="google-review-disclosure"><p>Reviews supplied by Google Maps in relevance order. Up to five are shown in their original language.</p>{data.attributions?.map((attribution, index) => attribution.uri ? <a key={index} href={attribution.uri} target="_blank" rel="noreferrer">{attribution.provider}</a> : <span key={index}>{attribution.provider}</span>)}</div>}
  </section>;
}
