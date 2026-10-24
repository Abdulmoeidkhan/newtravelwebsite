# Connect Rihla to Firebase

Project: `rihla-a5ae9`. The supplied public web-app configuration is saved in ignored `.env.local`. No service-account key or admin password belongs in frontend code. `.env.example` documents the required variables. The app does not enable Analytics.

## Authentication and database

Setup verified on 24 October 2026: CLI access to `rihla-a5ae9` works, the default Firestore database exists in `asia-southeast1`, and the repository's Firestore rules were successfully deployed. The first administrator, `admin@rihlatravelandtours.com`, was created and its `admin: true` claim verified. Public API signup is disabled (`client.permissions.disabledUserSignup: true`), while email/password login remains enabled. Use **Forgot your password** at `/admin` to choose the initial password; no initial password is stored in this repository. The local public reCAPTCHA Enterprise site key is still empty; Google reviews setup remains incomplete. Hosting and Functions were not deployed during this verification. Deployment of `createUser` was attempted but Firebase rejected it because the project needs the Blaze billing plan.

### Administrator-created users

Update, 24 October 2026: deployment was retried during the UI redesign and still requires Blaze. The owner chose to leave Firebase billing for later. Billing and function deployment are deferred until that decision changes.

The **Users** tab calls a server function that checks both the caller's admin token and current Firebase Auth role. It creates ordinary accounts without administrator privileges. These accounts cannot manage packages, media, or other users. The administrator can explicitly send a password setup email after creation. There is no public signup page or client-side account creation.

After enabling Blaze in the Firebase console, deploy the function:

```sh
firebase deploy --only functions:rihla:createUser --project rihla-a5ae9
```

The local operator script `node scripts/firebase-admin-setup.mjs inspect` verifies authentication configuration using the installed Firebase CLI login. `lock-signup` enforces the signup restriction, and `bootstrap` idempotently creates/grants the specified initial administrator. It does not print tokens or passwords. This script is only for a trusted local operator, never the frontend.

1. In [Firebase Authentication](https://console.firebase.google.com/project/rihla-a5ae9/authentication), enable **Email/Password** and create the intended administrator user. Add the website domain (and `localhost` for development) to authorized domains.
2. Create the default **Cloud Firestore** database in the Firebase console if it does not already exist. Deploy the included rules before relying on draft privacy.
3. Authenticate the CLI locally and deploy rules:

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore --project rihla-a5ae9
```

4. Grant that user's Firebase Auth UID the `admin: true` claim from a trusted environment with Application Default Credentials. Firebase CLI login and Admin SDK credentials are separate. In Google Cloud Shell, authenticate as the project owner; on a local workstation use `gcloud auth application-default login` if needed. Do not download a service-account JSON into this repository.

```sh
npm ci --prefix functions
npm run grant-admin --prefix functions -- rihla-a5ae9 FIREBASE_AUTH_UID
```

5. Run `npm run dev` and open `/admin`. Sign in using the email/password created in the Firebase console. Users without the admin claim cannot read drafts or change data. Sign out and back in after changing roles. There is no public admin signup or hardcoded production account.

## Package management

- Create a package and save a draft. Set its title, tier, nights, price/currency, availability months, images, dates, hotel names, description, and inclusions.
- Total nights must equal Makkah + Madinah nights. If dates are provided, the departure month must be included in availability.
- Images use an HTTPS URL or an existing local asset path. File uploads are not part of this implementation.
- Check **Publish on the website** to make the package publicly readable. Uncheck it to return to draft.
- **Import example drafts** creates examples with stable IDs; existing imported records are not overwritten. They remain explicitly illustrative until edited.
- Public visitors subscribe only to `published == true`. An empty or failed live database never silently falls back to demo inventory. Without any Firebase configuration, local demo inventory is clearly marked.

## Google reviews

1. Enable **Places API (New)** in the Google Cloud project and configure billing/quota controls. Cloud Functions deployment requires the appropriate Firebase billing plan.
2. Create an API key restricted to Places API (New). Store it as a server-side secret:

```sh
npx firebase-tools functions:secrets:set GOOGLE_PLACES_API_KEY --project rihla-a5ae9
```

3. Register the web app with **Firebase App Check / reCAPTCHA Enterprise**, authorize your domains, and set the public `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` in `.env.local` and your production build environment. The reviews callable enforces App Check. An unregistered localhost must use an App Check debug token configured privately during development, or test the fallback UI.
4. In `/admin` → **Reviews & Shorts**, enter the Google Place ID of Rihla's listing. A Maps short URL is not a Place ID. Use Google's [Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder).
5. Deploy the function:

```sh
npx firebase-tools deploy --only functions:rihla:getGoogleReviews --project rihla-a5ae9
```

The function is in `asia-south1`, matching `VITE_FIREBASE_FUNCTIONS_REGION`. It fetches only the configured listing and never accepts arbitrary Places requests from visitors. Review content is not persisted to Firestore or browser storage. The section requests reviews when it approaches the viewport, preserves Google relevance order and original-language text, displays rating/count only when returned, and includes author/source attribution. Google Places returns a limited selection (up to five reviews), not an entire review archive. Configure API quotas for your expected traffic. On error, visitors retain a direct Google Maps link.

## YouTube Shorts

Add titles and Shorts/watch links or video IDs in **Reviews & Shorts**. The admin form extracts and validates the video ID. Add the channel URL separately if desired. The website uses a thumbnail until the visitor clicks Play; only one player is loaded at a time. Embeds use `youtube-nocookie.com`. Videos must be public and allow embedding. Changes publish when you save media settings; there is no automatic channel scraping.

## Build and deployment

```sh
npm ci
npm run build
npx firebase-tools deploy --only hosting --project rihla-a5ae9
```

`firebase.json` includes SPA rewrites so direct visits to `/admin` load correctly. If using another static host, configure the same fallback to `index.html`. Source access credentials, Google API secrets, and admin passwords are never built into the site. Firebase's web API key is public configuration; database security relies on the deployed rules, not hiding that key.

## Tests

```sh
npm test
npm test --prefix functions
```

For security and browser integration tests, install Java 21+ and start **isolated** emulators (never point these scripts at production):

```sh
npx firebase-tools emulators:start --only auth,firestore --project demo-rihla
```

In another terminal:

```sh
node --test scripts/firestore.rules.test.mjs
node functions/scripts/seed-emulators.mjs
node scripts/start-test-site.mjs
```

The test server uses port 5188 with its own in-process demo configuration; it does not alter `.env.local`. In a third terminal:

```sh
npm run test:browser
node scripts/admin-browser-check.mjs
```

Rules tests clear the **demo-rihla emulator only**. Run them before seeding browser fixtures. Browser test credentials are local fixtures and cannot authenticate against production. Screenshots are written to ignored `artifacts/`.

The inquiry form still uses explicit WhatsApp/email handoff; it does not persist leads. Newsletter requests also use email. These are independent of the package database.

## References

- [Firebase password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore security rules](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Google Places details](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Google reviews attribution requirements](https://developers.google.com/maps/documentation/places/web-service/policies)
- [YouTube embeds](https://developers.google.com/youtube/player_parameters)
