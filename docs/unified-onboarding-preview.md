# Unified learner onboarding — preview handoff

Base: leadwise1/LeadWise-Services, commit 8881e37fe3de5cb431418e0e5c2894bb73fa4ca6.
Branch: feat/unified-learner-onboarding. This branch is in the isolated Vercel workspace, not pushed to GitHub.
Production project: prj_FhS0Fcc6ryQ1JRbO7e9zzuCI8mN6; team team_L5P8wF9cDes63QT8OWqydh09.
Preview: https://sb-160t3ythc0de.vercel.run/learner (temporary sandbox server).

## Behavior
- Existing Firebase Auth instance is reused. Google sign-in links a guest UID where possible. An already existing Google account retains its UID; historical guest posts are never transferred/deleted automatically.
- Existing authenticated non-anonymous providers remain accepted by the API when their email is verified. Google is the new entry UI; no password/provider is disabled.
- Intake uses existing fields and /api/intake URL, behind matching client and server flags. Course catalog and provider URLs remain intact.
- A verified Firebase token and matching email are required. Consent is validated server-side.
- New intake, anonymous reporting row, learner membership, course request and notification outbox are written in one transaction.
- Repeated same-account/course requests do not reset status or add LMI report rows.
- Existing email-derived profiles are only linked after exact verified-email comparison. Collisions fail with staff-review response.
- Existing intake records, timestamps, enrollment approvals and historical anonymous rows are never overwritten/deleted.
- Course/provider enrollment remains Pending until staff provisions it; membership never represents provider access.
- Hub shows existing catalog, community links, weekly events, career tools and recent discussions.
- Forum retains existing public/guest access for compatibility. This patch does not make historical public posts private.

## Two reports
1. Private ledger queries profile/intake records only and includes names/email.
2. LMI queries learner_intakes only and returns an explicit field allowlist: anonymous ID, ZIP, income bracket, employment status, course, status, intake date. Names/email/private participant IDs never enter its response.
- Date parsing accepts both Firestore Timestamp and historical ISO strings; invalid dates remain Unknown.
- Monthly and income filters, print/save PDF, and separate report buttons are provided.
- Historical duplicate anonymous rows are retained. No unverifiable historical deduplication/migration is performed.
- Admin reports now require the existing verified Google community-administrator identity (COMMUNITY_ADMIN_EMAIL, default lakhani@letsleadwise.org). The previous shared access-code mechanism is removed. Verify Sarah's admin login in staging before release.
- No new Firestore rules were deployed. New private collections rely on the existing default-deny rule; Admin SDK handles authorized operations.

## Flags and configuration
Set both NEXT_PUBLIC_UNIFIED_ONBOARDING=true (build time) and UNIFIED_ONBOARDING_ENABLED=true (runtime) in an isolated staging environment.
Set LEARNER_NOTIFICATIONS_ENABLED=true only after reviewing notification destination and Resend sender. New outbox rows persist if notification delivery fails. Existing NOTIFY_EMAIL and RESEND_FROM_EMAIL are reused.
The preview deliberately contains no production Firebase Admin credentials or Resend credentials.
Public Firebase config and server Firebase Admin configuration are still required in a real staging deployment.
Confirm provider availability and authorized preview domain in Firebase Authentication.
Do not point a test deployment at live Firestore. Use an isolated Firebase test project with representative synthetic fixtures.
The report access improvement applies when this source is deployed; the live app is unchanged.

## Validation and remaining gates
- Next production build succeeded; TypeScript passed.
- 31 Node tests passed: existing forum/lab tests plus 11 onboarding and 7 reporting tests.
- Browser: learner hub and course navigation render successfully.
- Actual Google OAuth, live Firestore persistence, print-dialog output and successful admin-authenticated report rendering have NOT been end-to-end verified.
- Firebase CLI metadata inspection failed because local credentials are expired; database edition was not verified. Existing Admin SDK API usage was followed, with no database configuration/deployment.
- Repository npm lockfile is inconsistent (Next and Resend entries); clean npm ci fails before these changes. Validation used npm install --ignore-scripts --package-lock=false in isolation. No dependency manifest/lockfile changed. Resolve/pin the intended dependency lockfile before a reproducible deployment.
- No production deployment, database migration, enrollment update, notification send, or GitHub push was performed.

## Before production
1. Restore Firebase CLI authentication and verify intended existing database, edition and rules.
2. Connect writable GitHub source and push/review this branch.
3. Resolve the pre-existing lockfile issue in a separate reviewed change.
4. Deploy a Vercel preview against isolated test Firebase services, with matching flags.
5. Test new learner, existing enrollment claim, duplicate submission, revoked/unverified token, anonymous-to-permanent upgrade, existing-account collision, second course, notification failure/retry, sign-out and account switching.
6. Verify BOTH admin reports with synthetic fixtures, monthly filter, PDF print and absence of identifiers in LMI response/PDF.
7. Confirm current production SHA has not changed, stage a production build, verify it, then release through normal review.

Rollback: redeploy the prior commit (this is the tested full rollback, including reporting access); for onboarding-only fallback, disable both flags and rebuild. Do not delete newly created Firestore documents.
