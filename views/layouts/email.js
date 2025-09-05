const nodemailer = require("nodemailer");
let email = document.querySelector("email1");
const transport = nodemailer.createTransport({
  service: "email",
  auth: {
    user: asifhussain5115gmail.com,
    pass: 'umufazevltisxktj'
  }
});
async function emailsender() {
  const info = await transport.sendMail({
    from: '"MyShop" <asifhussain5115gmail>',
    to: `${email.value}`,
    subject: '🎉 Welcome to MyShop Newsletter!',
    html: ` <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0px 2px 6px rgba(0,0,0,0.1)">
            <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h2>Welcome to <span style="color: #ffe600;">MyShop</span>!</h2>
            </div>
            <div style="padding: 20px; color: #333; line-height: 1.6;">
              <p>Hi there 👋,</p>
              <p>Thank you for subscribing to <b>MyShop</b>! 🎉</p>
              <p>You’ll now be the first to know about:</p>
              <ul>
                <li>🔥 Exclusive discounts</li>
                <li>🛒 New arrivals & trending products</li>
                <li>🎁 Special offers just for you</li>
              </ul>
              <p style="margin-top: 20px;">Stay tuned, exciting updates are coming your way soon!</p>
            </div>
            <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #777;">
              © 2025 MyShop | All rights reserved
            </div>
          </div>
        </div>`,
  });
  console.log("Email send :", info);
}
emailsender().then(() => {
  console.log("Email is send successfully");
})