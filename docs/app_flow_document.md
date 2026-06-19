# App Flow Document for Denver Spotlight Community Platform

## Onboarding and Sign-In/Sign-Up

A new visitor arrives at the Denver Spotlight site by typing denverspotlight.org into their mobile or desktop browser, or by following a shared link on social media. On first load, a cookie-consent banner appears at the bottom of the screen inviting the user to accept essential cookies and opt in or out of marketing and analytics scripts, with a link to the Privacy Policy page. There is no login required to browse the marketing content in Phase 1: the Home, About, Events, Awards Info, Get Involved, Support, and Contact pages are fully open. When the user chooses to submit an interest form—whether to volunteer, sponsor, apply as a performer, or donate to the Artist Fund—the site presents a modal or dedicated form page where the user provides name, email, phone number, message, a consent checkbox, and then taps Submit. The submission calls the shared `emitEvent()` helper, which writes to the Supabase `inquiries` table and triggers Resend to send confirmation and notification emails. A toast notification confirms the receipt of the inquiry. In Phase 2, when the user attempts to cast a vote, RSVP to an event, or donate, the site prompts them to sign in with a passwordless email link. They enter their email address, receive a time-limited magic link or one-time code via email, click the link, and return to the site already authenticated. The header then shows a sign-out button. If the user loses the magic link or code, they can request a new one via the same email-entry flow. Social or OAuth sign-in options can be turned on later via a configuration flag but are off in Phases 1 and 2.

## Main Dashboard or Home Page

After signing in in Phase 2, or immediately for unauthenticated visitors in Phase 1, the home page opens as the default view. At the top sits the organization’s white-label logo and a responsive navigation bar listing the major sections: Home, About, Events, Awards Info, Get Involved, Support, and Contact. Directly below the header, a full-screen hero section features the configurable hero gradient background, a headline, and a call-to-action button. Scrolling reveals content cards for upcoming events, highlight reels of past winners, sponsor logos, and calls to action to join the community or support the Artist Fund. A sticky footer includes links to the Privacy Policy, social media icons, and the site’s contact email. In Phase 2, the header adds a user avatar or email hint once signed in and a sign-out button. If the user has admin privileges in Phase 3, a link to the Admin Dashboard appears next to the avatar.

## Detailed Feature Flows and Page Transitions

When the user taps "Get Involved" or any call-to-action button, the site transitions smoothly to a full-screen form view. The form fields and labels are determined by the `forms` array in `config/organization.ts`. Once the form is completed, the Submit button triggers `emitEvent('inquiry', formData)`. The user sees a success banner and is offered a link to return to the Home page or explore other sections.

In Phase 2, when the user clicks "Vote Now" on the Awards Info page, the site checks authentication. If not signed in, it overlays the magic‐link sign-in modal. After successful authentication, the user is redirected back to the ballot. The ballot page displays categories one at a time in an infinite scroll list. The user taps a nominee in each category, and each vote dispatches `emitEvent('vote', {categoryId, nomineeId, userId})`. When all votes are cast, a confirmation screen thanks the user and offers a link to view live leaderboards.

RSVP flows follow a similar path: clicking "RSVP" on an event card navigates to the event detail page with a form to confirm attendance. Submission emits an RSVP event and shows a ticket-like confirmation page. Donations to the Artist Fund live on a page where the user enters an amount, billing information, and taps "Donate." Stripe handles payment, and `emitEvent('donation', {amount, currency, userId})` writes a passport entry for Treasury. A receipt screen shows the amount, date, and a transparent split breakdown.

Profile and directory pages use MediaID DNA projections. On the Artists page, the user scrolls through an infinite list of profiles. Tapping a profile opens a dedicated page with bio, images, and "Similar Artists" suggestions powered by DNA similarity. Leaderboards and Hall of Fame pages in Phase 2 read from Coliseum projections and display animated lists of top-voted nominees, trending artists, and city-based rankings.

Phase 3 adds deep link sharing via CALS. On any nominee or event page, the user selects "Share," which copies a unique referral URL. If a new visitor arrives via that link and completes an action, the referral attribution is recorded. Sponsors access the Companon onboarding flow by clicking "Become a Sponsor," filling out their brand details in a form, and submitting. After admin approval in the back office, sponsor campaigns appear on the site, matched to artists by DNA. Admin users sign in and land on an Admin Dashboard with tabs to export contacts, moderate inquiries, manage sponsors, review donations and payouts, schedule events, and adjust site configuration flags.

## Settings and Account Management

Users manage their email preferences and view or edit their profile information on a dedicated Account Settings page. This page offers controls to update name, email, and phone, adjust notification preferences for RSVPs, votes, or donation receipts, and manage cookie consent choices via a persistent settings modal. For users who made donations or RSVPs, a History section lists past contributions and events. In Phase 3, admin users see additional settings for site theming, navigation items, Buckets feature flags, and Stripe payout split rules. A "Back to Site" link at the top of the settings returns users instantly to the last visited page in the main flow.

## Error States and Alternate Paths

If the user attempts to submit a form with missing or invalid fields, inline error messages appear under each field and the Submit button remains disabled until all validations pass. Network issues display a banner reading "You appear offline. Some features may be limited. Please check your connection." For authentication, entering an unregistered email for magic-link sign-in shows a message suggesting they check their spelling or sign up first. If a payment is declined, the donation form remains on screen with a clear error message from Stripe and an invitation to try another card. When a user tries to access a restricted admin page without proper permissions, the site redirects them to a "Not Authorized" page with a link back to the Home page.

## Conclusion and Overall App Journey

From the moment a newcomer lands on the homepage, they enjoy a seamless, mobile-first experience exploring content and interacting with calls to action. They can join the community by submitting a form with no barrier to entry. As the platform evolves to Phase 2, the journey deepens: the visitor becomes a registered user via password-less authentication, casts votes, RSVPs to events, and donates—all while every action feeds into the Buckets ecosystem. Live leaderboards and personalized profiles turn those interactions into immediate feedback. In Phase 3, the site scales into a full community hub with admin controls, sponsor campaigns, viral sharing, and a multi-tenant white-label framework. Throughout, the user’s path is intuitive: discover, interact, sign in when needed, and revisit a vibrant, data-driven community platform that grows richer with every event recorded.

```ascii
+-----------------+
| Landing Page    |
+-----------------+
         |
         v
+--------------------------+
| Browse Static Content    |
+--------------------------+
         |
         v
+-----------------+       Phase 1
| Interest Form   |----------------------+        Phase 2/3
+-----------------+                      |
         |                                |
         v                                v
+--------------------------+     +---------------------+
| Submit -> Confirmation   |     | Voting/RSVP/Donate  |
+--------------------------+     +---------------------+
                                        |
                                        v
                                 +------------------+
                                 | Sign-In (Magic)  |
                                 +------------------+
                                        |
                                        v
                                 +------------------+
                                 | Interact & Emit  |
                                 +------------------+
                                        |
                                        v
                                 +------------------+
                                 | Confirmation &   |
                                 | Leaderboards     |
                                 +------------------+
                                        |
                                        v
                                 +------------------+
                                 | Profile Pages    |
                                 +------------------+
                                        |
                                        v
                                 +------------------+
                                 | Admin Dashboard  |
                                 +------------------+
```