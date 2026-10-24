# Rihla Travel and Tours

See [Project status and next steps](PROJECT_STATUS_AND_NEXT_STEPS.md) for completed work, verified Firebase setup, launch blockers, and the prioritized roadmap compared with UmrahLane (reviewed 24 October 2026).

The latest UI uses a centered hero, larger Outfit typography, tabbed services, a horizontal quote form, and a four-column footer following the reference's homepage structure. Firebase billing and backend deployment are deferred at the owner's request; see the progress file for current limitations.

Responsive React 18 + TypeScript + Vite website, with Tailwind CSS 3 brand tokens, Firebase Auth/Firestore, Lucide icons, Framer Motion, Radix dialogs/tabs, React Hook Form, and Zod. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for the admin/database/reviews setup and [COMPARISON.md](COMPARISON.md) for the UmrahLane comparison.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Node.js 22.12+ or 24+ is recommended.

```sh
npm run test
npm run build
npm run preview
```

The production site is generated in `dist/`; deploy that folder to a static host.

Browser integration tests use an isolated Firebase emulator and test server at `http://127.0.0.1:5188`; see the setup guide. Screenshots are saved to ignored `artifacts/`. PostCSS selector-parser and gRPC overrides use patched transitive dependencies.

## Structure

- `src/components/`: modular public sections, Google reviews, YouTube Shorts, and admin forms.
- `src/pages/Admin.tsx`: authenticated package and media management at `/admin`.
- `src/hooks/`: real-time catalogue/settings subscriptions and admin-role verification.
- `functions/`: server-side Google Places proxy and trusted admin-role setup script.
- `firestore.rules`: server-enforced publication and admin permissions.
- `src/data/`: editable contact information, itineraries, service copy, and illustrative stories.
- `src/types/`: Package, Service, Review, InquiryFormData, and filter interfaces.
- `src/lib/`: validation, message formatting, and workflow tests.
- `tailwind.config.js`: the requested navy, ocean, gold, slate, and typography tokens (ES-module format for Vite).

## Business configuration

The site uses the supplied Karachi address, +92 335 3819460, and info@rihlatravelandtours.com. Update `src/data/site.ts` to change those details.

The connected site loads published packages from Firestore, supports PKR/USD/SAR, and does not fall back to samples on database failures. Sample imports are private, explicitly illustrative drafts. Google reviews load from the configured business listing through the server function, preserving author/source attribution. Shorts are curated in admin. No fabricated rating, accreditation, or USA/Saudi office claim is presented. Hajj 2027 actions request information; they do not guarantee registration, permits, or availability.

The quote form validates locally, then offers an explicit WhatsApp or email handoff. It does not store leads. The newsletter prepares an email subscription request. Firebase stores staff authentication records and CMS data; inquiries stay in memory until sent through the chosen external service. Analytics is not enabled.

## Assets and accessibility

Pilgrimage photos are bundled locally from Unsplash image IDs `photo-1565552645632-d725f8bfc19a`, `photo-1580418827493-f2b22c0a76cb`, and `photo-1591604129939-f1efa4d9f7fa`. Outfit and Playfair Display (wordmark) load from Google Fonts with system fallbacks. The Rihla wordmark is a custom typographic treatment, not a supplied official logo.

Includes a skip link, visible keyboard focus, accessible Radix dialogs with focus management, labeled forms with errors, reduced-motion support, and responsive mobile navigation.
