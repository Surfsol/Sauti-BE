const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
console.log(process.env.emailClientId, process.env.emailClientSecret, process.env.EMAILFROM)
const oauth2Client = new OAuth2(
  process.env.emailClientId, // ClientID
  process.env.emailClientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.emailRefreshToken
});

const accessToken = oauth2Client.getAccessToken();
let transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.EMAILFROM,
    //pass: process.env.PASSWORDFROM,
    type: "OAuth2",
    clientId: process.env.emailClientId,
    clientSecret: process.env.emailClientSecret,
    refreshToken: process.env.emailRefreshToken,
    accessToken: accessToken
  },
  tls: {
    rejectUnauthorized: false
  },
});

const sendResetPasswordEmail = (user, code, url) => {
  transporter.sendMail(
    {
      from: "Sauti Trade Insights <tradeinsights.sautiafrica@gmail.com>",
      to: `${user.email}`,
      subject: "Code Verification - NO REPLY",
      text: "For clients with plaintext support only",
      html: `<p>Hello ${user.email}, <br /> Your verifcation code to reset your password is <b>${code}</b>. <br /> Please visit <a href="${url}">Password Reset Verification Link</a> to reset your password.  </p>`
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

const sendAccountCancellation = (email, cancelDate) => {
  const link =
    "https://docs.google.com/forms/d/e/1FAIpQLSfeKJkwkHPvNO4fJo6OJfKCNSKnWH7UhraJ8bpFdRT4loutfw/viewform?usp=sf_link";
  transporter.sendMail(
    {
      from: "Sauti Trade Insights <tradeinsights.sautiafrica@gmail.com>",
      to: `${email}`,
      subject: "Subscription Cancellation - NO REPLY",
      text: "For clients with plaintext support only",
      html: `
      <html>
      <head>
      </head>
      <body style="padding: 20px;background-color: #f3f3f3;">
        <center>
          <div style="width: 300px;border: 15px solid #025467;padding: 50px;margin: 20px;">
            <h1 style="font-family: &quot;Roboto&quot;, sans-serif;font-size: 24px;color: #e84a34;">Two Week Trial Email Verification</h1>
            <p style="font-family: &quot;Nunito&quot;, sans-serif
            font-size: 14px;">Hi ${email}</name></p>
            <p style="font-family: &quot;Nunito&quot;, sans-serif
            font-size: 14px;">Thank you for using Sauti Trade Insights. We hope you found the information you were looking for.</p>
            <p style="font-family: &quot;Nunito&quot;, sans-serif
            font-size: 14px;">As per your request, your subscription has been cancelled. The good news is that your account will be active until ${cancelDate} and you can still access Sauti Trade Insights in the meantime.</end-date></p>
            <p style="font-family: &quot;Nunito&quot;, sans-serif
            font-size: 14px;">We’d like to learn the reason behind your cancellation so we can better serve our users (and hopefully you!) in the future .</p>
      
            <button  style="color: #f3f3f3;background-color: #e84a34;font-family: &quot;Roboto&quot;, sans-serif;font-size: 20px;border-color: transparent;border-radius: 4px;text-align: center;cursor: pointer;"><a href="${link}" style="text-decoration:none">Feedback Survey</a></button>
      
            <p style="font-family: &quot;Nunito&quot;, sans-serif
            font-size: 14px;">Thanks, The Sauti Team</p>
          </div>
        </center>
      </body>
      </html>
     `
    },
    (err, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

const sendVerifyAccount = (user, url) => {
  transporter.sendMail({
    from: "Sauti Trade Insights <tradeinsights.sautiafrica@gmail.com>",
    to: `${user.email}`,
    subject: "Email Verification - NO REPLY",
    text: "For clients with plaintext support only",
    html: `
    <head>
    </head>
    <body style="padding: 20px;background-color: #f3f3f3;">
    <center>
      <div>
        <h1 style="font-family: &quot;Roboto&quot;, sans-serif;font-size: 24px;color: #e84a34;">Two Week Trial Email Verification</h1>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Hi ${user.email}</p>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Thank you for signing up for Sauti Trade Insights</p>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Verify your email address to start your two week trial access. Click on the link below to verify that ${user.email} belongs to you.</p>
    ​
        <button style="color: #f3f3f3;background-color: #e84a34;font-family: &quot;Roboto&quot;, sans-serif;font-size: 20px;border-color: transparent;border-radius: 4px;text-align: center;cursor: pointer;"><a href="${url}" style="text-decoration:none">Verify Email</a></button>
    ​
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Thanks, The Sauti Team</p>
    ​
        <p style="font-size: 10pt;font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">*If you didn't recently attempt to create a new account with this email address, you can safely disregard this email.</p>
      </div>
    </center>
    ​
    </body>
    `
  });
};
const paidAccountEmail = user => {
  transporter.sendMail({
    from: "Sauti Trade Insights <tradeinsights.sautiafrica@gmail.com>",
    to: user.email,
    subject: `Welcome to Sauti Trade Insights!`,
    text: "For clients with plaintext support only",
    html: `<html>
    <head>
      
    </head>
    <body style="padding: 20px;background-color: #f3f3f3;">
    <center>
      <div style="width: 300px;border: 15px solid #025467;padding: 50px;margin: 20px;">
        <h1 style="font-family: &quot;Roboto&quot;, sans-serif;font-size: 24px;color: #e84a34;">Premium Access Account Email Verification</h1>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Hi <name>></name></p>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Thank you for signing up for Sauti Trade Insights</p>
        <p style="font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">Thanks, The Sauti Team</p>
        <p style="font-size: 10pt;font-family: &quot;Nunito&quot;, sans-serif
          font-size: 14px;">*If you didn't recently attempt to create a new account with this email address, you can safely disregard this email.</p>
      </div>
    </center>
    </body>
    </html>`
  });
};

const sendSuccess = (user, type) => {
  let subject = "";
  let html = "";
  let contact = "https://www.tradeinsights.sautiafrica.org/contact";
  switch (type) {
    case "verify":
      subject = "Email Verified - NO REPLY";
      html = `<p>Hello ${user.email}, <br /> Your email has been verified.</p>`;
      break;
    case "password":
      subject = "Password Changed - NO REPLY";
      html = `<p>Hello ${user.email}, <br /> Your password has been successfully changed.</p> <br /> If you did not change your password please contact us here.<a href="${contact}">Contact Sauti</a> </p>`;
      break;
    default:
      break;
  }
  transporter.sendMail({
    from: "Sauti Trade Insights <tradeinsights.sautiafrica@gmail.com>",
    to: user.email,
    subject: `${subject}`,
    text: "For clients with plaintext support only",
    html: `${html}`
  });
};

const contactEmail = input => {
  const output = `
          <p>You have a new contact request</p>
          <h3>Contact Details</h3>
          <ul>  
            <li>Name: ${input.name}</li>
            <li>Email: ${input.email}</li>
            <li>Nature of Inquiry: ${input.nature}</li>
          </ul>
          <h3>Message</h3>
          <p>${input.message}</p>
        `;
  const mailOptions = {
    from: process.env.EMAILFROM,
    to: process.env.EMAILTO,
    subject: "respond mail",
    text: "text",
    html: output //variable from above
  };
  transporter.verify(function (error, success) {
    if (error) {
      return error;
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return "Error occured." + err.message;
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return "message sent";
  });
};



module.exports = {
  paidAccountEmail,
  sendSuccess,
  sendVerifyAccount,
  sendResetPasswordEmail,
  contactEmail,
  sendAccountCancellation
};