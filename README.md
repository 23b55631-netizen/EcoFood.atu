# EcoFood ATU

Responsive trilingual MVP for food-waste registration, review, reporting, and ESG analytics at ATU University.

## Run locally

Run the included server so authentication and shared persistence work:

```powershell
node server.mjs
```

Open `http://127.0.0.1:4174`. Data is stored in `data/ecofood.json` and survives server restarts. Sessions are HttpOnly cookies and expire after eight hours; active sessions do not survive a server restart.

Demo accounts use password `demo2026`:

- `operator@atu.kz`: creates, edits drafts and resubmits returned reports.
- `reviewer@atu.kz`: reviews reports, manages goals, reports and analytics.
- `admin@atu.kz`: full access.
- `leadership@atu.kz`: read-only access to the registry, reports, analytics and ESG goals.

The server stores reports, photos, review history, notifications and reduction goals in a local JSON database. This is a functioning single-server MVP, not production infrastructure. Passwords are fixed demo credentials and uploaded images are stored as data URLs. Production deployment requires hashed passwords or institutional SSO, a managed database, object storage, backups, rate limiting, CSRF protection and HTTPS.

Waste reduction includes required reason selection, product cost per kg, a live potential-savings calculator, goals normalized per 100 meals, and a local change history. Recommendations use only approved reports with a known reason; legacy demo records are not assigned invented causes. Goal measurements are manually entered and are not claimed to be automatically measured savings.

Role permissions are enforced by the local server. Collection-point QR images are rendered through QuickChart and encode a form link with a location ID. Camera QR decoding and offline synchronization are not implemented. The history is useful for the MVP but is not a cryptographically tamper-proof audit log.

## Six tracks

1. **Digital Forms:** organization templates, expanded waste categories, date entry, daily/monthly totals and server-side range validation.
2. **Mobile Input:** responsive forms, drafts, camera photo input and location QR links.
3. **Submission Workflow:** draft → submitted → in review → approved/returned, comments, reminders and event history.
4. **Organizations & Roles:** seven ATU units and four enforced roles (operator, reviewer, administrator and leadership).
5. **Consolidation & Reporting:** approved registry, month/quarter/year views, filtered Excel/PDF output and missing-submission control.
6. **Analytics & Dashboard:** trends, composition, organization comparison, recyclable share, anomalies, mass, CO₂e and water indicators.

Validate calculations and the complete server workflow with:

```powershell
node --test tests/impact.test.cjs tests/server.test.mjs
```
