# Rihla: completed work and next steps

Last reviewed: **27 October 2026 (Asia/Karachi)**.

## 27 October — Google Reviews audit and catalogue freshness

- Added a keyboard-accessible **Show password** checkbox to admin sign-in. Passwords are hidden by default; toggling visibility preserves the entered value and does not submit the form.

- Added `node scripts/check-reviews-setup.mjs`, a read-only audit using the existing Firebase CLI login. It checks billing, Places API, secret-version metadata (never secret values), the review function, saved Place ID, Shorts count and App Check.
- Live audit: billing is disabled; Places API is disabled; `getGoogleReviews` is absent; saved Place ID is empty; five Shorts remain configured; App Check has no configured Enterprise site key. Secret metadata returned HTTP 403, so secret existence could not be verified. No billing changes or deployment were attempted.
- Live reviews remain blocked until billing is resumed and the API, secret, verified Place ID and App Check are configured. The current Google listing link remains usable.
- Implemented the roadmap's public catalogue freshness behavior: departures before today's Karachi date disappear from upcoming packages; flexible packages expire after their last availability month. Old months are removed from public filters. Open pages refresh the date every minute and when the window receives focus.
- This is public filtering, not a database archive operation: records remain unchanged and accessible in admin. Staff can still unpublish offers using the existing publication control. No sample packages were published.
- Added tests for Karachi midnight, past departures with future return dates, today's/future departures, flexible monthly availability and preservation of original records.
- Validation: all 38 frontend tests passed; the TypeScript/production build passed. Existing dependency-comment and Firebase bundle-size warnings remain. The audit script also passed Node syntax checking.

## Latest media update

**Review-strip layout:** added the requested summary-and-carousel design below Special Packages. Connected reviews display the actual numeric rating, fractional gold stars, rating count, author details, dates, expandable text and Google Maps source links. Desktop shows three cards; smaller layouts show two or one with scrolling and arrow controls. Missing review data shows the business-listing link without invented ratings, reviews or verification badges. Production build passed. Carousel layout checks use isolated synthetic fixtures, never published as customer feedback. Live Google review setup remains deferred as described below.

- Added the five owner-supplied YouTube Shorts in the requested order: `aFiR4rl_DVE`, `8ywYSrDHbNc`, `4FhNQ6myeDg`, `H7jjEXH7oUo`, `iCgLc6hNI0M`.
- Retrieved public video titles from YouTube; all five returned valid oEmbed metadata for **Rihla Travels**. Added the verified channel link `https://www.youtube.com/@RihlaTravels`.
- Saved and read back the ordered Shorts and channel in Firestore `settings/public`. The admin media screen can edit them. Initial local settings also contain the supplied videos; valid saved admin settings take precedence, including an intentionally empty list.
- Updated the Google listing/contact link to the owner's supplied `https://share.google/sEyrPrHvbYvObdthf`, resolving to “Rihla Travels – Umrah & Flight Agency.” Google blocked automated Place ID lookup, so no Place ID was guessed or saved.
- Shorts now appear below the Google reviews section. Google reviews continue to offer the business-listing link; live review cards still require Place ID/API/App Check configuration and the deferred backend deployment.
- No billing changes or Hosting deployment were made.

## Latest update — reference layout and readability

**Brand color correction:** restored Rihla's original palette from `tailwind.config.js`: navy `#0F172A`, ocean blue `#2563EB`, gold `#F59E0B`, and slate surfaces. The reference site's teal/yellow styling was replaced across navigation, buttons, tabs, hero overlay, forms and footer. The larger typography and reference-inspired structure are retained. Light admin/footer wordmarks remain readable on dark backgrounds.

The homepage has been restructured using a fresh desktop browser inspection of [UmrahLane](https://umrahlane.com/), including its rendered typography and full-page layout. This supersedes the earlier text-only comparison below.

Completed in this update:

- Replaced the small editorial typography with Outfit, the reference's heading family. Desktop hero type is 72px at a 1440px viewport, section headings are approximately 38px, and primary reading text/forms/actions use 16–17px. Secondary text is generally 14px; compact brand lettering is smaller.
- Rebuilt the header with a contact strip, white navigation, grouped Umrah dropdown, and gold quote action. Mobile navigation remains accessible through a dialog.
- Centered the hero and aligned its height, overlay and primary action with the reference's structure.
- Reordered the homepage: hero → service highlights → packages → tabbed services → special packages → reviews/media → Hajj interest → company information → horizontal quote form → four-column footer/newsletter.
- Replaced the old service-card grid with four keyboard-accessible service tabs and a text/two-image panel.
- Retained package filtering in the catalogue, including month, tier and party type, plus the detail-dialog-to-inquiry handoff.
- Reworked Hajj interest into a centered section and company information into a photo/content layout with expandable details and FAQs.
- Rebuilt the quote form as a horizontal desktop row that stacks on mobile; validation and explicit WhatsApp/email handoff are preserved.
- Increased small text sizes across the public site and admin forms; strengthened footer text contrast.
- Retained Rihla's branding, photos, contact details and truthful content. The reference's accreditation/partner logo strip is represented by Rihla service highlights, not unverified affiliations. This is a close structural adaptation, not a measured claim of 99% pixel equivalence.

**Content state:** the connected catalogue returned no published packages in the browser check. Separate sample-data previews are used only to test card layouts and interactions; no example inventory was published to production. Missing reviews and media configuration still produce honest fallback content.

**Firebase step 1:** backend deployment was retried and again rejected because Blaze is required. The owner explicitly chose **“Leave Firebase billing for later.”** Billing and Functions deployment are therefore deferred; do not retry or link a billing account until the owner resumes this step. Existing admin creation, signup restrictions and Firestore rules remain in place.

**Preview:** `npm run dev` opens the current local implementation. Screenshots are saved under ignored `artifacts/`, including `reference-desktop.png`, `rihla-redesign-desktop.png` and `rihla-redesign-mobile.png`. No Hosting deployment was performed for this redesign.

**Redesign verification:** all 34 frontend unit tests passed. Browser checks passed against isolated sample data for package filters, package-dialog handoff, form validation, WhatsApp links, service tabs and keyboard navigation, Umrah dropdown, section order, mobile menus and floating contact actions. No horizontal overflow was detected at 320, 390, 768, 1024 or 1440px. Desktop/mobile screenshots were also inspected with the connected catalogue's empty state. The TypeScript/production build passed; the existing Firebase bundle-size warning remains.

Rihla has a working website implementation, content management screens, and a connected Firebase project. It is **not yet a fully deployed, operational website**: user creation and Google reviews need backend deployment, and production hosting/domain verification remains outstanding.

This document combines repository inspection with Firebase actions verified in this development session. It does not assume that sample content has been replaced or that every production workflow has been tested.

## 1. What has been completed

| Area | Completed work | Current status |
| --- | --- | --- |
| Website foundation | React, TypeScript, Vite, responsive layouts, brand colors, typography, local imagery, mobile navigation | Implemented locally; production build passes |
| Homepage | Hero/search, package collection, special programs, services, accommodation planning, Hajj interest, company introduction, planning steps, inquiry section and footer | Implemented |
| Package browsing | Month, tier and party-type filters; dates, nights, hotel names, inclusions, prices and detail dialogs | Implemented; details do not have individual URLs |
| Package currencies | PKR, USD and SAR price display | Implemented; no live exchange-rate conversion |
| Contact | Karachi address, phone, email, map, WhatsApp and floating contact actions | Implemented using supplied business details |
| Inquiries | Validated quote form, package-to-inquiry handoff, explicit WhatsApp/email sending | Implemented; inquiries are not saved in a database |
| Newsletter | Email subscription-request handoff | Implemented; no subscriber database or automated campaigns |
| Accessibility | Skip link, labeled fields, visible focus, accessible dialogs and reduced-motion support | Implemented; full production accessibility audit pending |
| Admin login | Email/password login, password reset, session handling and admin-role checks at `/admin` | Implemented; first admin exists in Firebase |
| Package management | Create, edit, publish, unpublish, delete and import private example drafts | Implemented; live business inventory still needs confirmation |
| Media management | Google Place ID, YouTube channel and up to 12 curated Shorts | Implemented; real media/settings still need configuration |
| User management | Admin-only Users screen and server function; current admin role checked server-side | Implemented and unit-tested; function deployment blocked by billing |
| Account permissions | Newly created users receive no admin privileges | Implemented; ordinary users currently have no separate dashboard or management access |
| Google reviews | Server proxy, attribution, loading/error handling and Maps fallback | Implemented; not operational until configuration and deployment are complete |
| Website information | Privacy/use dialog explaining current data handling and quote limitations | Implemented; full business-approved booking/refund policies remain outstanding |

### Firebase changes actually verified

- Project access works for `rihla-a5ae9`.
- The default Firestore database exists in `asia-southeast1` (Singapore).
- Repository Firestore security rules were successfully deployed. Public visitors can read published packages; edits and draft access require the admin role.
- `admin@rihlatravelandtours.com` was created and its `admin: true` claim verified.
- Public account signup was disabled in Firebase itself, not merely hidden from the website.
- Email/password login remains enabled. Set the first administrator password using **Forgot your password** at `/admin`; receipt and successful login have not yet been verified.
- No initial password or Firebase CLI token was saved in project source.

### Validation completed in this session

- 34 frontend/unit workflow tests passed before the user-management addition.
- All 7 backend tests passed after that addition, including rejection of anonymous users, ordinary users, demoted/disabled administrators, invalid input and attempted role injection.
- The production build passed after adding user management.
- The build reports a large Firebase bundle and dependency comment warnings; these do not prevent the build.
- Existing browser and Firestore-rule test scripts are available, but were not rerun in this continuation. A production end-to-end test is still needed.

## 2. What is incomplete or blocked

| Item | What remains |
| --- | --- |
| Backend deployment | Firebase rejected deployment of `createUser` because the project needs the Blaze billing plan. The Users screen cannot create live accounts until this function is deployed. |
| Google reviews | Configure the real Place ID, Places API secret, App Check/reCAPTCHA Enterprise, and deploy the reviews function. The public reCAPTCHA site key was empty at the last check. |
| Hosting and domain | Hosting was not deployed during this session. Connect the intended domain, verify HTTPS and Firebase authorized domains, and test direct `/admin` navigation. |
| Business content | Confirm real packages, departure dates, prices, hotel arrangements, inclusions, imagery and contact details before launch. Production inventory contents were not audited. |
| Lead management | There is no persisted inquiry inbox, assignment, follow-up status or automated acknowledgement. |
| User workflow | Ordinary accounts have no defined business workflow yet. Decide whether they are customers or staff before adding further permissions. |
| Assets | Image fields accept URLs/local paths; there is no admin image-upload workflow. |
| Search discovery | Basic page title/description exist. Dedicated page metadata, sitemap, robots file and structured business data are not implemented in the inspected source. |

## 3. Comparison with UmrahLane

The [UmrahLane homepage](https://umrahlane.com/) was reviewed on 24 October 2026. It visibly presents package categories and dated offers, services, Hajj interest, reviews, company information and inquiry/contact actions. It also links to package pages, accommodations, registration, a blog, gallery and separate policies. Its homepage displays accreditation/partner branding.

The package, accommodation and registration subpages could not be retrieved during this review. Their internal features, booking behavior, payments, admin system and backend capabilities are **not verified**. This is a content/navigation comparison, not a visual or performance audit.

| Comparison area | Rihla position | Recommended improvement |
| --- | --- | --- |
| Homepage coverage | Most comparable sections already exist | Prioritize accurate content and reliable operation over adding more homepage sections |
| Package discovery | Filters and detail dialogs are implemented | Give each package a shareable page with a stable URL and its own metadata |
| Service information | Rihla uses homepage sections | Add useful dedicated service/accommodation pages with confirmed details |
| Inquiry and registration | Rihla hands off to WhatsApp/email | Add a saved inquiry workflow first; introduce booking registration only when the operational process is defined |
| Reviews and media | Rihla integrations are implemented but incomplete | Activate genuine Google reviews and publish approved photos/Shorts |
| Trust information | Rihla has company copy and contact information | Add the real logo, team/office photographs and verifiable business credentials |
| Editorial and policy pages | Rihla has no blog and only a website-use dialog | Add original travel guidance and approved standalone policy pages |

Do not copy the reference company's prices, reviews, accreditation, partnerships, office locations or experience claims. Use only Rihla's verified information.

One opportunity identified in the reference: its homepage showed June/July 2026 packages under “upcoming” at the original review time. Rihla now filters expired departures from the public catalogue while retaining records for staff. [Source: reference homepage](https://umrahlane.com/).

## 4. Recommended order of work

### Priority 1 — Finish a usable launch

1. **Deferred by owner: Firebase Blaze.** When the owner resumes billing setup, enable Blaze and deploy `functions:rihla:createUser`. Until then, live admin-created accounts remain blocked.
2. **Owner + developer: verify administrator access.** Set the password for `admin@rihlatravelandtours.com`, sign in, and verify package creation and publication. Verify an ordinary user cannot create users or access management features.
3. **Owner: supply real launch content.** Start with 3–6 confirmed packages, hotel details, inclusions/exclusions, room occupancy pricing, current dates, approved imagery and the official logo.
4. **Developer + owner: finish reviews/media setup.** Configure the Google listing and required services; add approved Shorts. Check real success and fallback behavior.
5. **Developer: deploy and test hosting.** Verify the domain, HTTPS, mobile layout, direct admin navigation, password reset, package inquiries and contact links.

**Completion check:** a visitor can view genuine current packages and contact Rihla; the administrator can sign in and manage content; user creation succeeds only for an admin; production errors and missing integrations are resolved or clearly handled.

### Priority 2 — Improve package pages and inquiry handling

1. Add individual package URLs, category pages and package-specific social sharing metadata.
2. Extend package information with itinerary, room-sharing options, exclusions, meal arrangements and verified hotel distance information where available.
3. **Public expiry filtering completed 27 October.** Expired departures are hidden automatically; admin retains the records and can unpublish offers. A separate archival status is not implemented.
4. Save inquiries securely with package reference, contact details, travel preferences, status and assigned staff. Keep passport/document collection outside this first inquiry step.
5. Define staff versus customer roles before giving ordinary accounts new access.

**Completion check:** a visitor can share a specific package and submit an inquiry that staff can find and follow up without relying solely on chat history.

### Priority 3 — Build credibility and search visibility

1. Add dedicated About, Contact, accommodation and service pages with original Rihla content.
2. Publish approved privacy, booking terms and cancellation/refund information on stable URLs.
3. Add sitemap, robots configuration, canonical URLs, page metadata and accurate structured business data; connect Search Console after domain launch.
4. Publish a small set of original planning guides based on the questions Rihla actually receives.
5. Optimize images and JavaScript delivery, then measure mobile performance on the deployed site. Establish inquiry conversion measurement if the business wants analytics.

**Completion check:** important pages can be discovered and shared independently, business information is consistent, and mobile performance has been measured rather than assumed.

### Later — Only when the business process is ready

Consider quote PDFs, booking records, payment collection, customer dashboards, document uploads and automated email campaigns after inquiry handling and staff responsibilities work reliably. None of these should be described as completed today.

## 5. Immediate inputs needed from the owner

- Firebase billing decision to unblock Functions deployment.
- Access to the administrator mailbox for password setup.
- Confirmed package inventory and approved brand/media assets.
- Google Business listing/Place ID and chosen YouTube content.
- Domain/DNS access when ready to publish.
- Definition of what newly created users should be able to do.
- Approved booking, payment, cancellation and refund terms.

## 6. Related project files

- [Firebase setup and deployment](FIREBASE_SETUP.md)
- [Project overview and commands](README.md)
- [Earlier feature comparison](COMPARISON.md)
- [Admin interface](src/pages/Admin.tsx)
- [Admin-only user creation](functions/users.js)
- [Firestore security rules](firestore.rules)

**Recommended next development milestone:** complete the Firebase launch requirements, publish genuine inventory, then build dedicated package pages and an admin inquiry inbox.
