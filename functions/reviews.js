export function safeHttps(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
export function normalizePlace(place) {
  return {
    name: place.displayName?.text || '', rating: typeof place.rating === 'number' ? place.rating : null,
    count: Number.isInteger(place.userRatingCount) ? place.userRatingCount : 0,
    mapsUrl: safeHttps(place.googleMapsUri),
    attributions: (place.attributions || []).map(item => ({ provider: String(item.provider || ''), uri: safeHttps(item.providerUri) })),
    reviews: (place.reviews || []).map(review => ({
      name: String(review.name || ''), author: String(review.authorAttribution?.displayName || 'Google user'),
      authorUrl: safeHttps(review.authorAttribution?.uri), photoUrl: safeHttps(review.authorAttribution?.photoUri),
      text: String(review.originalText?.text || review.text?.text || ''), rating: typeof review.rating === 'number' ? Math.max(1, Math.min(5, review.rating)) : 0,
      date: String(review.relativePublishTimeDescription || ''), sourceUrl: safeHttps(review.googleMapsUri) || safeHttps(place.googleMapsUri),
    })),
  };
}
