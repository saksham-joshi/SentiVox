'use server'

import nodemailer from 'nodemailer'
import { VALUES } from '@/lib/values'
import { COLORS } from '@/lib/colors'
import { OTP_CONFIGS } from '../otp/values'

const AUTH_EMAIL = process.env.AUTH_EMAIL
const AUTH_EMAIL_PASSWORD = process.env.AUTH_EMAIL_PASSWORD

if (!AUTH_EMAIL || !AUTH_EMAIL_PASSWORD) {
  console.error(
    'You forgot to add AUTH_EMAIL or AUTH_EMAIL_PASSWORD in .env file!'
  )
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_EMAIL_PASSWORD,
  },
})

if (!transporter) {
  console.error('Unable to create Gmail Transporter!')
}

export async function sendOTPMail(
  __email: string,
  __otp: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${VALUES.APP_NAME}" <${AUTH_EMAIL}>`,
      to: __email,
      subject: `Your OTP for ${VALUES.APP_NAME}`,
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code – ${VALUES.APP_NAME}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

    <!-- Ambient aurora background -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="
        background-color: transparent;
        background-image:
          radial-gradient(ellipse 70% 50% at 20% 10%, rgba(2, 187, 173, 0.13) 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(24, 184, 120, 0.09) 0%, transparent 50%),
          radial-gradient(ellipse 50% 60% at 60% 90%, rgba(39, 107, 155, 0.11) 0%, transparent 55%);
        padding: 48px 20px;
        min-height: 100vh;
      ">
      <tr>
        <td align="center" valign="middle">
          <!--  CARD -->
          <table width="600" cellpadding="0" cellspacing="0"
            style="
              max-width: 600px;
              background: linear-gradient(160deg, rgba(8, 21, 38, 0.97) 0%, rgba(3, 15, 31, 0.99) 60%, rgba(4, 42, 57, 0.95) 100%);
              border-radius: 20px;
              border: 1px solid ${COLORS.dark.border};
              box-shadow:
                0 0 0 1px rgba(2, 187, 173, 0.07),
                0 40px 100px rgba(0, 0, 0, 0.65),
                0 0 80px rgba(2, 187, 173, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.04),
                inset 0 -1px 0 rgba(2, 187, 173, 0.04);
            ">

            <!-- Top gradient accent bar -->
            <tr>
              <td style="
                height: 3px;
                background: linear-gradient(90deg,
                  transparent 0%,
                  ${COLORS.dark.aura.blue} 15%,
                  ${COLORS.dark.primary} 40%,
                  ${COLORS.dark.aura.teal} 65%,
                  ${COLORS.dark.teal} 85%,
                  transparent 100%);
                border-radius: 20px 20px 0 0;
              "></td>
            </tr>

            <!-- HEADER -->
            <tr>
              <td style="padding: 44px 48px 36px 48px; text-align: center;">

                <!-- Icon badge -->
                <table cellpadding="0" cellspacing="0" style="margin: 0px auto 0px auto;">
                  <tr>
                    <td align="center"
                      style="
                        width: 320px; height: 180px;
                      ">
                      <img src="https://cdn.jsdelivr.net/gh/saksham-joshi/SentiVox@main/Images/Senti-Vox-bgremoved-rectangle.png" style="width:100%;height:100%;" alt="Logo"/>
                      </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hairline divider -->
            <tr>
              <td style="padding: 0 48px;">
                <div style="height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.dark.border}, ${COLORS.dark.borderStrong}, ${COLORS.dark.border}, transparent);"></div>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 40px 48px 36px 48px;">

                <p style="margin: 0 0 10px 0; font-size: 19px; font-weight: 600; color: ${COLORS.dark.text}; line-height: 1.4; opacity:0.7">
                  Your one-time password to
                  <strong style="color: ${COLORS.dark.text};">Login/Register</strong>
                  is here:
                </p>

                <!-- OTP GLASS BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 36px 0;">
                  <tr>
                    <td align="center"
                      style="
                        background: linear-gradient(160deg, rgba(2,187,173,0.07) 0%, rgba(24,184,120,0.04) 50%, rgba(4,42,57,0.3) 100%);
                        border: 1px solid rgba(2, 187, 173, 0.22);
                        border-radius: 16px;
                        padding: 40px 28px 32px 28px;
                        box-shadow:
                          0 0 48px rgba(2, 187, 173, 0.07),
                          inset 0 1px 0 rgba(255, 255, 255, 0.05),
                          inset 0 -1px 0 rgba(2, 187, 173, 0.04);
                      ">

                      <!-- OTP label -->
                      <p style="
                        margin: 0 0 18px 0;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 3.5px;
                        text-transform: uppercase;
                        color: ${COLORS.dark.textMuted};
                      ">One-Time Password</p>

                      <!-- OTP digits container -->
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                        <tr>
                          <td align="center"
                            style="
                              background: rgba(1, 5, 16, 0.55);
                              border: 1px solid rgba(2, 187, 173, 0.18);
                              border-radius: 12px;
                              padding: 22px 40px;
                              box-shadow: inset 0 2px 8px rgba(0,0,0,0.35), 0 0 30px rgba(2,187,173,0.06);
                            ">
                            <span style="
                              font-size: 52px;
                              font-weight: 800;
                              color: ${COLORS.dark.primary};
                              letter-spacing: 14px;
                              font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
                              text-shadow:
                                0 0 20px rgba(2, 187, 173, 0.6),
                                0 0 50px rgba(2, 187, 173, 0.25),
                                0 0 80px rgba(24, 184, 120, 0.1);
                              display: block;
                              line-height: 1;
                            ">${__otp}</span>
                          </td>
                        </tr>
                      </table>
                      <!-- Expiry pill -->
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td align="center"
                            style="
                              background: rgba(2, 187, 173, 0.08);
                              border: 1px solid rgba(2, 187, 173, 0.18);
                              border-radius: 999px;
                              padding: 6px 18px;
                            ">
                            <span style="font-size: 12px; color: ${COLORS.dark.textSecondary};">
                              Expires in&nbsp;
                              <strong style="color: ${COLORS.dark.primary};">${Math.floor(OTP_CONFIGS.expireTimeInSeconds / 60)} minutes</strong>
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!-- SECURITY NOTICE -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
                  <tr>
                    <td style="
                      background: rgba(228, 93, 120, 0.06);
                      border: 1px solid rgba(228, 93, 120, 0.18);
                      border-left: 3px solid ${COLORS.dark.danger};
                      border-radius: 0 10px 10px 0;
                      padding: 14px 18px;
                    ">
                      <p style="margin: 0; font-size: 13px; line-height: 1.65; color: ${COLORS.dark.textSecondary};">
                        <strong style="color: ${COLORS.dark.danger};">Security notice:&nbsp;</strong>
                        Never share this code with anyone.
                        <strong style="color: ${COLORS.dark.text};">${VALUES.APP_NAME}</strong>
                        will never ask for your OTP over a call or chat.
                      </p>
                    </td>
                  </tr>
                </table>
                <!-- Ignore notice -->
                <p style="margin: 0; font-size: 13px; line-height: 1.65; color: ${COLORS.dark.textDisabled}; font-style: italic;">
                  Didn't request this code? You can safely ignore this email — no action is needed, and your account remains secure.
                </p>

              </td>
            </tr>
            <!-- Hairline divider -->
            <tr>
              <td style="padding: 0 48px;">
                <div style="height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.dark.border}, ${COLORS.dark.borderStrong}, ${COLORS.dark.border}, transparent);"></div>
              </td>
            </tr>
            <!-- FOOTER -->
            <tr>
              <td style="padding: 28px 48px 40px 48px; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 500; color: ${COLORS.dark.textMuted};">
                  © ${new Date().getUTCFullYear()} <span style="color: ${COLORS.dark.primary};">${VALUES.APP_NAME}</span>. All rights reserved.
                </p>
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.dark.textDisabled};">
                  Multi-Lingual Sentiment Analysis Site + API
                </p>
              </td>
            </tr>
            <!-- Bottom gradient accent bar -->
            <tr>
              <td style="
                height: 3px;
                background: linear-gradient(90deg,
                  transparent 0%,
                  ${COLORS.dark.teal} 15%,
                  ${COLORS.dark.aura.teal} 40%,
                  ${COLORS.dark.primary} 60%,
                  ${COLORS.dark.aura.blue} 85%,
                  transparent 100%);
                border-radius: 0 0 20px 20px;
              "></td>
            </tr>
          </table>
          <!-- end CARD -->
        </td>
      </tr>
    </table>
    <!-- end aurora wrapper -->
  </body>
</html>
      `,
    })

    return true
  } catch (err) {
    console.error('Failed to send mail : ' + err)
  }

  return false
}

export async function sendEmailToAllUsers(
  __subject: string,
  __html_mail: string,
  __email_list: string[]
): Promise<boolean> {
  try {
    const bcc_list = __email_list.join(',')

    await transporter.sendMail({
      from: `"${VALUES.APP_NAME}" <${AUTH_EMAIL}>`,
      subject: __subject,
      bcc: bcc_list,
      html: __html_mail,
    })

    return true
  } catch (err) {
    console.error(
      'Error caught while sending emails to all users!\nError: ' + err
    )
  }

  return false
}

export async function sendEmail(
  __recipient_email: string,
  __subject: string,
  __html_mail: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${VALUES.APP_NAME}" <${AUTH_EMAIL}>`,
      subject: __subject,
      to: __recipient_email,
      html: __html_mail,
    })

    return true
  } catch (err) {
    console.error(
      `Error caught while sending email to "${__recipient_email}"\nError: ${err}`
    )
  }

  return false
}
