import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePlace, safeHttps } from '../reviews.js';
test('preserves Google attribution, original review language, relevance order, and source links', () => {
  const result = normalizePlace({ displayName: { text: 'Rihla' }, rating: 4.9, userRatingCount: 42, googleMapsUri: 'https://maps.google.com/', reviews: [{ name: 'reviews/one', authorAttribution: { displayName: 'A traveller', uri: 'https://maps.google.com/profile', photoUri: 'https://example.com/avatar.jpg' }, originalText: { text: 'Original words' }, text: { text: 'Translated words' }, rating: 5, googleMapsUri: 'https://maps.google.com/review' }] });
  assert.equal(result.reviews[0].text, 'Original words'); assert.equal(result.reviews[0].author, 'A traveller'); assert.equal(result.reviews[0].sourceUrl, 'https://maps.google.com/review'); assert.equal(result.count, 42);
});
test('does not manufacture ratings or accept unsafe links', () => {
  assert.equal(normalizePlace({}).rating, null); assert.deepEqual(normalizePlace({}).reviews, []); assert.equal(safeHttps('javascript:alert(1)'), '');
});
