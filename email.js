const nodemailer = require('nodemailer');

async function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'asifhussain5115@gmail.com',
        pass: 'umufazevltisxktj', // app password (no spaces)
      },
    });

    const info = await transporter.sendMail({
      from: '"E-Commerce Store" <asifhussain5115@gmail.com>',
      to: '2023cs646@gmail.com',
      subject: '🎉 Welcome to Our E-Commerce Store!',
      text: 'You have successfully logged in to our E-Commerce platform. Welcome!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>Welcome to E-Commerce</h1>
            </div>
            
            <div style="padding: 20px; text-align: center;">
              <h2>🎊 Login Successful!</h2>
              <p style="font-size: 16px; color: #333;">
                Hello <b>User</b>, you have successfully logged into your E-Commerce account.
              </p>
              
              <div style="margin: 20px 0;">
                <div style="background:#f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                  <h3>🛒 Explore Products</h3>
                  <p>Check out the latest gadgets, fashion, and accessories available now.</p>
                </div>
                
                <div style="background:#f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                  <h3>💳 Easy Payments</h3>
                  <p>Pay securely using multiple payment options.</p>
                </div>
                
                <div style="background:#f9f9f9; padding: 15px; border-radius: 8px;">
                  <h3>🚚 Fast Delivery</h3>
                  <p>Get your favorite products delivered to your doorstep quickly.</p>
                </div>
              </div>

              <a href="http://localhost:3000" 
                style="display: inline-block; background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Start Shopping
              </a>
            </div>
            
            <div style="background: #eee; color: #555; text-align: center; padding: 15px; font-size: 12px;">
              &copy; 2025 E-Commerce Store. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    console.log('✅ Message sent:', info.messageId);
  } catch (err) {
    console.error('❌ Email error:', err);
  }
}

sendEmail();
