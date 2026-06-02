import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ConfirmationEmailParams {
  to: string
  firstName: string
  date: string        // ex: "Lundi 16 juin 2025"
  startTime: string   // ex: "09:00"
  endTime: string     // ex: "11:00"
  service: string
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams) {
  const { to, firstName, date, startTime, endTime, service } = params

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8ddd5;">

          <!-- Header -->
          <tr>
            <td style="background:#1A0A00;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#FAF7F2;letter-spacing:0.02em;">ndossi_hair</p>
              <p style="margin:6px 0 0;font-size:12px;color:#FAF7F2;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">Toulouse</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 8px;font-size:16px;color:#1A0A00;">Bonjour <strong>${firstName}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#3B1F0E;line-height:1.6;">
                Votre rendez-vous est bien enregistré. Voici le récapitulatif :
              </p>

              <!-- Recap card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;border-radius:12px;border:1px solid #e8ddd5;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0;font-size:11px;color:#9b7b6a;text-transform:uppercase;letter-spacing:0.08em;">Date</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1A0A00;">📅 ${date}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;border-top:1px solid #e8ddd5;padding-top:12px;">
                          <p style="margin:0;font-size:11px;color:#9b7b6a;text-transform:uppercase;letter-spacing:0.08em;">Horaire</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1A0A00;">🕐 ${startTime} – ${endTime}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid #e8ddd5;padding-top:12px;">
                          <p style="margin:0;font-size:11px;color:#9b7b6a;text-transform:uppercase;letter-spacing:0.08em;">Prestation</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#C4622D;">💇 ${service}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#3B1F0E;line-height:1.7;">
                En cas d'empêchement ou pour toute question, contactez-nous directement sur Instagram :
                <a href="https://instagram.com/ndossi_hair" style="color:#C4622D;font-weight:600;text-decoration:none;">@ndossi_hair</a>
              </p>

              <p style="margin:0;font-size:15px;color:#1A0A00;font-weight:600;">À très bientôt ! 🌿</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FAF7F2;border-top:1px solid #e8ddd5;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9b7b6a;">
                <strong style="color:#1A0A00;">ndossi_hair</strong> — Salon de coiffure afro · Toulouse
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return resend.emails.send({
    from: 'ndossi_hair <noreply@ndossihair.fr>',
    to,
    subject: 'Votre rendez-vous chez ndossi_hair est confirmé ✓',
    html,
  })
}
