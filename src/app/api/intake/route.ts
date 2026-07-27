import { NextRequest, NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase-admin";
import { Resend } from "resend";

/** Generate a short anonymized student ID for LMI grant reports, e.g. "user_7HsNxt" */
function generateAnonymousId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "user_";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Build the HTML email body sent to mentor@letsleadwise.org */
function buildAdminEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  zipCode: string;
  householdIncome: string;
  employmentStatus: string;
  courseTitle: string;
  enrolledAt: string;
  lmiVerified: boolean;
}): string {
  const incomeLabels: Record<string, string> = {
    "0-25k": "$0 – $25,000",
    "25-50k": "$25,001 – $50,000",
    "50-75k": "$50,001 – $75,000",
    "75k+": "$75,001+",
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New LeadWise Enrollment Request</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1B2735 0%,#2d3f55 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;color:#FFBEA0;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">LeadWise Foundation</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.2;">📋 New Enrollment Request</h1>
              <p style="margin:10px 0 0 0;color:#94a3b8;font-size:14px;">A learner is waiting to be provisioned on Coursera</p>
            </td>
          </tr>

          <!-- LMI Badge -->
          ${data.lmiVerified ? `
          <tr>
            <td style="background:#ecfdf5;border-bottom:1px solid #d1fae5;padding:14px 40px;text-align:center;">
              <span style="background:#10b981;color:#ffffff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:1px;">✓ LMI ELIGIBLE — Grant Qualifies</span>
            </td>
          </tr>` : `
          <tr>
            <td style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:14px 40px;text-align:center;">
              <span style="background:#f59e0b;color:#ffffff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:1px;">⚠ INCOME ABOVE LMI THRESHOLD</span>
            </td>
          </tr>`}

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Learner Details -->
              <h2 style="margin:0 0 20px 0;color:#1B2735;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #f1f5f9;padding-bottom:10px;">Learner Details</h2>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Full Name</span><br/>
                    <span style="color:#0f172a;font-size:16px;font-weight:700;margin-top:2px;display:block;">${data.firstName} ${data.lastName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email Address</span><br/>
                    <a href="mailto:${data.email}" style="color:#FF9E80;font-size:15px;font-weight:600;margin-top:2px;display:block;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Zip Code</span><br/>
                    <span style="color:#0f172a;font-size:15px;font-weight:600;margin-top:2px;display:block;">${data.zipCode}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Household Income</span><br/>
                    <span style="color:#0f172a;font-size:15px;font-weight:600;margin-top:2px;display:block;">${incomeLabels[data.householdIncome] ?? data.householdIncome}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Employment Status</span><br/>
                    <span style="color:#0f172a;font-size:15px;font-weight:600;margin-top:2px;display:block;text-transform:capitalize;">${data.employmentStatus}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Requested Course</span><br/>
                    <span style="color:#0f172a;font-size:15px;font-weight:700;margin-top:2px;display:block;">${data.courseTitle}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Submitted At</span><br/>
                    <span style="color:#0f172a;font-size:14px;margin-top:2px;display:block;">${new Date(data.enrolledAt).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "full", timeStyle: "short" })} (CST)</span>
                  </td>
                </tr>
              </table>

              <!-- Action Box -->
              <div style="margin-top:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
                <h3 style="margin:0 0 12px 0;color:#1B2735;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">⚡ Next Steps</h3>
                <ol style="margin:0;padding-left:18px;color:#475569;font-size:14px;line-height:2;">
                  <li>Go to the <strong>Coursera Admin Portal</strong></li>
                  <li>Invite <strong>${data.email}</strong> to the <em>${data.courseTitle}</em> program</li>
                  <li>Reply to the learner to let them know they're in</li>
                </ol>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">LeadWise Foundation · Sent automatically on new enrollment request · <a href="https://services.letsleadwise.org" style="color:#FF9E80;text-decoration:none;">services.letsleadwise.org</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email,
      zipCode, householdIncome, employmentStatus,
      courseId, courseTitle, consent,
    } = body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !zipCode || !householdIncome || !employmentStatus || !courseId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!adminDb) {
      console.error("Intake API: Firebase Admin not initialized.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const enrolledAt = new Date().toISOString();
    const lmiVerified = ["0-25k", "25-50k"].includes(householdIncome);

    // ── PATH 1: Full learner profile in users/{participantId}/profile/intake ──
    // Keyed by a stable ID derived from the email so duplicate submissions are idempotent.
    const participantId = email.toLowerCase().replace(/[^a-z0-9]/g, "_");

    await adminDb
      .collection("users")
      .doc(participantId)
      .collection("profile")
      .doc("intake")
      .set({
        participantId,
        firstName,
        lastName,
        email,
        zipCode,
        householdIncome,
        employmentStatus,
        targetCourse: courseTitle,
        courseId,
        consent: consent ?? false,
        status: "Pending",      // Changed from "Enrolled" — admin must provision first
        enrolledAt,
        lmiVerified,
      }, { merge: true });

    // ── PATH 2: Anonymous demographic record in learner_intakes ──────────────
    // Used for LMI grant reporting only — NO name or email stored here.
    const anonymousId = generateAnonymousId();

    await adminDb.collection("learner_intakes").doc(anonymousId).set({
      studentId: anonymousId,
      zipCode,
      incomeBracket: householdIncome,
      employmentStatus,
      courseId,
      courseTitle,
      status: "Pending",
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ── PATH 3: Email notification to admin ──────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL ?? "mentor@letsleadwise.org";

    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const fromAddress = process.env.RESEND_FROM_EMAIL ?? "enrollments@letsleadwise.org";
        await resend.emails.send({
          from: `LeadWise Enrollments <${fromAddress}>`,
          to: [notifyEmail],
          subject: `📋 New Enrollment Request — ${firstName} ${lastName} (${courseTitle})`,
          html: buildAdminEmailHtml({
            firstName,
            lastName,
            email,
            zipCode,
            householdIncome,
            employmentStatus,
            courseTitle: courseTitle ?? "Unknown Course",
            enrolledAt,
            lmiVerified,
          }),
        });
        console.log(`✅ Enrollment notification sent to ${notifyEmail}`);
      } catch (emailErr) {
        // Log but don't fail the request — data is already saved to Firestore
        console.error("⚠️ Email notification failed (non-fatal):", emailErr);
      }
    } else {
      console.warn("⚠️ RESEND_API_KEY not set — skipping email notification.");
    }

    return NextResponse.json({ success: true, studentId: anonymousId }, { status: 200 });
  } catch (err: unknown) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
