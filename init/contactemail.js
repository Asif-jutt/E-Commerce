const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMessageFromUser({ userEmail, subject, message, name }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS,   // app password
      },
    });

    const mailOptions = {
      from: `"${name || 'Website Visitor'}" <${process.env.EMAIL_USER}>`, // sender is your email
      replyTo: userEmail, // user can be replied directly
      to: process.env.EMAIL_USER, // your email
      subject: subject || `Message from ${name || 'User'}`,
      text: `Name: ${name || 'Anonymous'}\nEmail: ${userEmail}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Message from ${userEmail}</h2>
          <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 10px; background: #f4f4f4; border-radius: 5px;">${message}</div>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This message was sent from MyShop.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Message sent from user:', userEmail, info.messageId);
  } catch (err) {
    console.error('❌ Email error:', err);
    throw err;
  }
}

module.exports = sendMessageFromUser;
