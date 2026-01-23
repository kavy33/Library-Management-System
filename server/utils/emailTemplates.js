export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #0f172a;
    border-radius: 8px;
  ">
    
    <h2 style="
      color: #ffffff;
      text-align: center;
      margin-bottom: 20px;
    ">
      Verify Your Email Address
    </h2>

    <p style="font-size: 16px; color: #cbd5e1;">
      Dear User,
    </p>

    <p style="font-size: 16px; color: #cbd5e1;">
      To complete your registration or login, please use the verification code below:
    </p>

    <div style="
      text-align: center;
      margin: 30px 0;
    ">
      <span style="
        display: inline-block;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 4px;
        background-color: #ffffff;
        color: #0f172a;
        padding: 12px 28px;
        border-radius: 6px;
      ">
        ${otpCode}
      </span>
    </div>

    <p style="font-size: 15px; color: #cbd5e1;">
      This code is valid for <strong>15 minutes</strong>.  
      Please do not share this code with anyone.
    </p>

    <p style="font-size: 15px; color: #cbd5e1;">
      If you did not request this email, please ignore it.
    </p>

    <hr style="border: none; border-top: 1px solid #334155; margin: 30px 0;">

    <footer style="
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    ">
      <p>
        Thank you,<br>
        <strong>BookWorm Team</strong>
      </p>
      <p style="font-size: 12px; color: #64748b;">
        This is an automated message. Please do not reply.
      </p>
    </footer>

  </div>
  `;
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
   return `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #000;
    color: #fff;
  ">
    
    <h2 style="
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
    ">
      Reset Your Password
    </h2>

    <p style="font-size: 16px; color: #ccc;">
      Dear User,
    </p>

    <p style="font-size: 16px; color: #ccc;">
      You requested to reset your password. Please click the button below to proceed:
    </p>

    <div style="text-align: center; margin: 25px 0;">
      <a href="${resetPasswordUrl}" style="
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        color: #000;
        text-decoration: none;
        padding: 12px 24px;
        border: 1px solid #fff;
        border-radius: 5px;
        background-color: #fff;
      ">
        Reset Password
      </a>
    </div>

    <p style="font-size: 15px; color: #ccc;">
      If you did not request this, please ignore this email.  
      The link will expire in <strong>10 minutes</strong>.
    </p>

    <p style="font-size: 15px; color: #ccc;">
      If the button above doesn’t work, copy and paste the following URL into your browser:
    </p>

    <p style="
      font-size: 14px;
      color: #fff;
      word-break: break-all;
    ">
      ${resetPasswordUrl}
    </p>

    <footer style="
      margin-top: 25px;
      text-align: center;
      font-size: 14px;
      color: #666;
    ">
      <p>
        Thank you,<br>
        <strong>BookWorm Team</strong>
      </p>
      <p style="font-size: 12px; color: #444;">
        This is an automated message. Please do not reply to this email.
      </p>
    </footer>

  </div>
  `;

}

