export const newAcountMail = (username, link) => {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bid And Shops</title>
    
  </head>
  <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div class="container" style="max-width: 600px; margin: 50px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Welcome to Bid And Shops!</h2>
          <p style="color: #555;">Dear ${username},</p>
          <p style="color: #555;">We're thrilled to have you on board. Bid And Shops is your platform for seamless collaboration and communication. Get ready to experience a new way of working together!</p>
          <p style="color: #555;">To get started, click the button below:</p>
          <a href="${link}" class="btn" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Activate Your Account</a>
          <p style="color: #555;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="color: #555;"><a href="${link}">${link}</a></p>
          <div class="footer" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777;">
              <p style="color: #555;">Thank you for choosing Bid And Shops. If you have any questions or need assistance, feel free to contact our support team at codexsourav404@gmail.com.</p>
          </div>
      </div>
  </body>
  </html>
      `
};


export const resetPassMail = (name, link) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Hello, ${name}</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; color: #333;">
          <!-- Replace the following line with the dynamic OTP value you generate -->
          <strong>${link}</strong>
        </div>
        <p>This OTP is valid for a short period of time. Do not share it with anyone.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Best regards,<br>Bid And Shops</p>
      </div>
    </body>
    </html>
  `
}

export const SuccessfullyChangePasswordMail = (name) => {
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
  </head>
  <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  
    <div class="container" style="max-width: 600px; margin: 30px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2>Password Change Successful</h2>
      <p style="color: #666;">Hello ${name},</p>
      <p style="color: #666;">Your password for Bid And Shops has been successfully changed.</p>
      <p style="color: #666;">If you did not make this change, please contact us immediately.</p>
      <p style="color: #666;">Thank you for using Bid And Shops.</p>
    </div>
  
    <div class="footer" style="margin-top: 30px; text-align: center; color: #888;">
      <p style="color: #666;">This email was sent by Bid And Shops. Please do not reply to this email.</p>
    </div>
  
  </body>
  </html>
  
    `;
}


export const successfullyEmailVerified = (name) => {
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
  </head>
  <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  
    <div class="container" style="max-width: 600px; margin: 30px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2>Email Verification Successful</h2>
      <p style="color: #666;">Hello ${name},</p>
      <p style="color: #666;">Your email address has been successfully verified with Bid And Shops.</p>
      <p style="color: #666;">Thank you for verifying your email and joining our community.</p>
      <p style="color: #666;">Best regards,<br>Bid And Shops Team</p>
    </div>
  
    <div class="footer" style="margin-top: 30px; text-align: center; color: #888;">
      <p style="color: #666;">This email was sent by Bid And Shops. Please do not reply to this email.</p>
    </div>
  
  </body>
  </html>
  
    `;
}