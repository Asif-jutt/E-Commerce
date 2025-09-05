const nodemailer = require('nodemailer');
require('dotenv').config();
async function sendEmail(toEmail) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"E-Commerce Store" <asifhussain5115@gmail.com>',
      to: toEmail,
      subject: 'Welcome to Our E-Commerce Community - Exclusive Benefits Await!',
      text: `Thank you for subscribing to our E-Commerce platform. You'll now receive exclusive updates, promotions, and early access to new products. Welcome to our community!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our E-Commerce Store</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f7f7f7;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto; max-width: 600px;">
                <!-- Header -->
                <tr>
                    <td style="padding: 20px 0; text-align: center; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                        <img src="https://via.placeholder.com/200x50/4CAF50/ffffff?text=E-Commerce+Store" alt="E-Commerce Store Logo" style="max-width: 200px;">
                    </td>
                </tr>
                
                <!-- Hero Section -->
                <tr>
                    <td style="background-color: #4CAF50; padding: 40px 20px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Our E-Commerce Family!</h1>
                        <p style="margin: 15px 0 0; font-size: 16px; opacity: 0.9;">Your subscription has been confirmed</p>
                    </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                    <td style="padding: 30px 20px; background-color: #ffffff;">
                        <p style="margin: 0 0 20px; color: #333333; line-height: 1.6;">Hello valued customer,</p>
                        <p style="margin: 0 0 20px; color: #333333; line-height: 1.6;">Thank you for subscribing to our newsletter. You've taken the first step toward enjoying a more personalized shopping experience with exclusive benefits:</p>
                        
                        <ul style="margin: 0 0 20px; padding-left: 20px; color: #333333; line-height: 1.6;">
                            <li>First access to new product launches</li>
                            <li>Exclusive subscriber-only discounts</li>
                            <li>Seasonal promotions and special offers</li>
                            <li>Curated product recommendations</li>
                        </ul>
                        
                        <p style="margin: 0 0 25px; color: #333333; line-height: 1.6;">We're committed to bringing you the best products at competitive prices with exceptional service.</p>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td align="center">
                                    <a href="http://localhost:8080" style="display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">Explore Our Collection</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Additional Benefits -->
                <tr>
                    <td style="padding: 25px 20px; background-color: #f9f9f9;">
                        <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px;">What to Expect Next</h3>
                        <p style="margin: 0; color: #666666; line-height: 1.6; font-size: 14px;">You'll receive our weekly newsletter every Tuesday featuring new arrivals, special promotions, and style inspiration. We carefully curate our communications to ensure they provide real value.</p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="padding: 20px; text-align: center; background-color: #eeeeee; color: #666666; font-size: 12px;">
                        <p style="margin: 0 0 10px;">&copy; 2025 E-Commerce Store. All rights reserved.</p>
                        <p style="margin: 0 0 10px; font-size: 11px;">123 Commerce Street, Business District, City, Country</p>
                        <p style="margin: 0;">
                            <a href="#" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a> | 
                            <a href="#" style="color: #4CAF50; text-decoration: none;">Terms of Service</a> | 
                            <a href="#" style="color: #4CAF50; text-decoration: none;">Unsubscribe</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });

    console.log('✅ Message sent to:', toEmail, info.messageId);
  } catch (err) {
    console.error('❌ Email error:', err);
    throw err;
  }
}

module.exports = sendEmail;