import { Facebook, Instagram, WhatsApp } from "../../../config.js";

export const templates = {
  ["Confirm_Email"]: (data) => {
    return `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
            
            <!-- Dynamic Header -->
            <tr>
              <td align="center" style="padding: 30px 20px; background-color: #4f46e5; color: #ffffff;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700;">${
                  data.title
                }</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 25px; text-align: left; color: #333333;">
                <!-- Dynamic Message -->
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                  ${data.message}
                </p>

                <!-- OTP Box -->
                <div style="text-align: center; margin: 30px 0;">
                  <span style="display: inline-block; background-color: #f3f4f6; color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; border: 1px dashed #6366f1;">
                    ${data.otpCode}
                  </span>
                </div>

                <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                  If you did not request this code, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer with Social Icons -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #f9fafb; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                
                <!-- Social Media Links -->
                <div style="margin-bottom: 15px;">
                  <!-- Facebook -->
                  <a href=${Facebook} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="display: block; border: 0;">
                  </a>
                  <!-- Instagram -->
                  <a href=${Instagram} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" style="display: block; border: 0;">
                  </a>
                  <!-- WhatsApp -->
                  <a href=${WhatsApp} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width="24" height="24" style="display: block; border: 0;">
                  </a>
                </div>

                <p style="margin: 0;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  },
  ["Forgot_password"]: (data) => {
    return `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
            
            <!-- Dynamic Header -->
            <tr>
              <td align="center" style="padding: 30px 20px; background-color: #4f46e5; color: #ffffff;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700;">${
                  data.subject
                }</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 25px; text-align: left; color: #333333;">
                <!-- Dynamic Message -->
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                  ${data.message}
                </p>

                <!-- OTP Box -->
                <div style="text-align: center; margin: 30px 0;">
                  <span style="display: inline-block; background-color: #f3f4f6; color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; border: 1px dashed #6366f1;">
                    ${data.otpCode}
                  </span>
                </div>

                <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                  If you did not request this code, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer with Social Icons -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #f9fafb; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                
                <!-- Social Media Links -->
                <div style="margin-bottom: 15px;">
                  <!-- Facebook -->
                  <a href=${Facebook} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="display: block; border: 0;">
                  </a>
                  <!-- Instagram -->
                  <a href=${Instagram} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" style="display: block; border: 0;">
                  </a>
                  <!-- WhatsApp -->
                  <a href=${WhatsApp} target="_blank" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width="24" height="24" style="display: block; border: 0;">
                  </a>
                </div>

                <p style="margin: 0;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  },
};

templates["Enable_2Step_Verification"] = templates["Forgot_password"];

templates["Login_2Step_Verification"] = templates["Forgot_password"];

export const generateOTPTemplate = (data) => {
  return templates[data.subject](data);
};
