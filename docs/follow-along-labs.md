# Follow-Along Labs

Labs reuse `artifacts/leadwise-web/public/data/sessions`. Manage session records through the existing Firebase Admin/Console workflow; this feature does not change Firestore rules.

Session fields:

- `topic`, `desc`, `mentor`: learner-facing strings.
- `eventDate`: date-only `YYYY-MM-DD` announcement when the start time is TBD.
- `timeZone`: IANA timezone; the December 5 lab uses `America/Chicago`.
- `startsAt`, `endsAt`: Firestore timestamps, epoch milliseconds, or ISO timestamps including the UTC offset. Default duration: 90 minutes.
- `meetUrl`: full HTTPS Google Meet room URL.
- `prep`: array of prerequisite checklist strings.
- `clue`: scenario preview string.

Joining and checkpoints open 15 minutes before `startsAt` and close at `endsAt`. A date-only announcement permits RSVPs but does not unlock joining or calendar links. Calendar links include the Meet room. The list refreshes every 15 seconds while open.

RSVPs and checkpoint responses use verified Firebase identities, including the community's anonymous sign-in flow. One document per learner under `sessions/{sessionId}/participants/{uid}` prevents repeat RSVPs from inflating counts. Check-ins replace the previous signal. Shared counts and optional community names are returned, not UIDs. Notes stay on the learner's device.

Screen sharing and voice run in Google Meet; the website does not embed or record meetings.

Quiet Focus Sprint loops a locally hosted recording instead of synthesized noise. Playback is opt-in, defaults to 25% volume, and stops when the page unmounts. Recording credits: `public/audio/CREDITS.txt`.
