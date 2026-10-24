# Rihla / UmrahLane comparison

Reference reviewed: https://umrahlane.com/ on 24 October 2026. This compares visible site structure, not booking performance or undisclosed integrations.

| Reference feature | Rihla implementation |
| --- | --- |
| Upcoming Umrah packages with dates and durations | Firestore catalogue with departure/return dates, category, party type, available months, currency, pricing, inclusions, and hotel names |
| Special Umrah section | Dedicated section populated from published Special Programs |
| Hotels, flights/visa, transportation, and Ziyarah | Existing four service pillars plus Makkah/Madinah accommodation planning section |
| Hajj 2027 pre-registration | Dedicated interest section and prefilled inquiry handoff; no unsupported permit or allocation promise |
| Why choose the company / company background | Rihla-specific Karachi introduction and three concrete planning commitments |
| Guest testimonials | Live Google Places reviews integration with author attribution and source links; previous example testimonials removed from the page |
| Gallery / video presence | Admin-managed YouTube Shorts with click-to-play privacy-enhanced embeds |
| Custom journey / registration workflow | Existing validated quote form, package-to-inquiry handoff, planning steps, and FAQs |
| Partner and accreditation logos | Deliberately omitted pending Rihla's verified partnerships and accreditation details |
| Blog and policy links | Competitor articles and legal policies are not copied. Rihla-specific editorial and booking policies require approved business content |
| Contact and social links | Supplied Karachi contact details; optional YouTube channel added through admin settings |

Additional requested capability: `/admin` uses Firebase email/password authentication with an `admin: true` custom claim. Firestore rules enforce access independently of the UI. Packages support create/edit/publish/unpublish/delete, and sample imports are private drafts. Public settings manage the Google Place ID, YouTube channel, and up to 12 Shorts.

No competitor pricing, reviews, hotel contracts, accreditation numbers, or experience claims were represented as Rihla's own.
