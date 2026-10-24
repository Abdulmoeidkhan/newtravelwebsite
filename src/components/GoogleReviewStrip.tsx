import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageSquareQuote, Star } from 'lucide-react';
import type { GoogleReview, GoogleReviewsResponse } from '../types';

function RatingStars({ rating }: { rating: number }) {
  return <span className="rating-stars" role="img" aria-label={`${rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <span className="rating-star" key={index}><Star aria-hidden="true"/><span style={{ width: `${Math.max(0, Math.min(1, rating - index)) * 100}%` }}><Star aria-hidden="true"/></span></span>)}</span>;
}

function ReviewCard({ review, mapsUrl }: { review: GoogleReview; mapsUrl: string }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="google-strip-card"><header><div className="google-strip-avatar">{review.photoUrl ? <img src={review.photoUrl} alt="" loading="lazy" referrerPolicy="no-referrer"/> : <span aria-hidden="true">{review.author.slice(0, 1).toUpperCase()}</span>}</div><div className="google-strip-author">{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noreferrer">{review.author}</a> : <strong>{review.author}</strong>}<span>{review.date}</span></div><a className="google-strip-source" href={review.sourceUrl || mapsUrl} target="_blank" rel="noreferrer" aria-label={`View ${review.author}'s review on Google Maps`}><ArrowUpRight size={20}/></a></header>
    <RatingStars rating={review.rating}/>
    <blockquote dir="auto" className={expanded ? 'expanded' : ''}>{review.text || 'This traveller left a rating without a written review.'}</blockquote>
    {review.text.length > 140 && <button className="review-expand" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Read less' : 'Read more'}<span className="sr-only">: review by {review.author}</span></button>}
    <a className="google-strip-attribution" href={review.sourceUrl || mapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
  </article>;
}

export default function GoogleReviewStrip({ data, mapsUrl, loading, unavailable, onRetry }: { data: GoogleReviewsResponse | null; mapsUrl: string; loading: boolean; unavailable: boolean; onRetry: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState({ previous: false, next: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setArrows({ previous: element.scrollLeft > 2, next: element.scrollLeft + element.clientWidth < element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element); element.addEventListener('scroll', update, { passive: true }); update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, [data]);
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const card = element.querySelector('article');
    element.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 280) + 20), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  const hasReviews = !!data?.reviews.length;
  return <div className="google-review-strip"><aside className="google-rating-summary" aria-label="Google review summary">
    {data?.rating != null ? <><strong className="google-rating-number">{data.rating.toFixed(1)} <small>/ 5</small></strong><RatingStars rating={data.rating}/><p>Based on <strong>{data.count.toLocaleString()} ratings</strong></p></> : <><MessageSquareQuote size={32} aria-hidden="true"/><h3>Traveller reviews</h3><p>Read our travellers’ experiences on Google Maps.</p></>}
    <a className="google-attribution" href={mapsUrl} target="_blank" rel="noreferrer" translate="no">Google Maps</a>
  </aside><div className="google-review-carousel" role="region" aria-label="Traveller reviews" aria-roledescription="carousel">
    {hasReviews ? <><button className="review-carousel-arrow previous" disabled={!arrows.previous} onClick={() => move(-1)} aria-label="Previous reviews" aria-controls="google-review-track"><ChevronLeft size={22}/></button><div id="google-review-track" className="google-review-track" ref={track} tabIndex={0} aria-label="Scroll through Google reviews">{data.reviews.map((review, index) => <ReviewCard key={review.name || index} review={review} mapsUrl={mapsUrl}/>)}</div><button className="review-carousel-arrow next" disabled={!arrows.next} onClick={() => move(1)} aria-label="Next reviews" aria-controls="google-review-track"><ChevronRight size={22}/></button></> : <div className="google-review-unavailable" role="status"><h3>{loading ? 'Loading traveller reviews…' : 'Every journey has a story.'}</h3><p>{loading ? 'Getting reviews from Google Maps.' : data ? 'No written reviews are available from Google yet.' : unavailable ? 'Reviews could not be loaded right now. You can still read our business listing.' : 'Visit our Google business listing to read traveller feedback or share your experience with Rihla.'}</p><a className="button button-primary" href={mapsUrl} target="_blank" rel="noreferrer">Read reviews on Google Maps <ArrowUpRight size={18}/></a>{unavailable && <button className="text-link" onClick={onRetry}>Try again</button>}</div>}
  </div></div>;
}
