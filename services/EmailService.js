const nodemailer = require("nodemailer");
//Error: Invalid login: 535-5.7.8 Username and Password not accepted. Learn more at
//535 5.7.8  https://support.google.com/mail/?p=BadCredentials e24sm4013757qka.76 - gsmtp
// let transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, 
//   auth: {
//     user: 'tradeinsights.sautiafrica@gmail.com',
//     pass: 'SautiAfrica2016'
//   }
// });


  let transporter = nodemailer.createTransport({
      host: "127.0.0.1",
      port: 1025,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sautiafrica@protonmail.com", 
        pass: "SautiAfrica2016"
      }, 
      tls: {
          rejectUnauthorized: false
      }
    });

const sendResetPasswordEmail = (user, code, url) => {
  console.log("console sendResetPaassssssss user, code", user, code);
  transporter.sendMail({
    from: "Databank Sauti Africa <tradeinsights.sautiafrica@gmail.com>",
    to: `${user.email}`,
    subject: "Code Verification - NO REPLY",
    text: "For clients with plaintext support only",
    html: `<p>Hello ${user.email}, <br /> Your verifcation code to reset your password is <b>${code}</b>. <br /> Please visit <a href="${url}">Password Reset Verification Link</a> to reset your password.  </p>`
  });
};

const contactEmail = input => {
  const output = `
          <p>You have a new contact request</p>
          <h3>Contact Details</h3>
          <ul>  
            <li>Name: ${input.name}</li>
            <li>Email: ${input.email}</li>
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
      console.log(
        "transporterrrrrrrrrr not verifiedddddddddddddddd",
        error
      );
      return error;
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  console.log("mailOptions", mailOptions);
  transporter.sendMail(mailOptions, (err, info) => {
    console.log("err", err, "info", info);
    if (err) {
      console.log("Error occured." + err.message);
      return "Error occured." + err.message;
    }

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return "message sent";
  });
}


exports.sendResetPasswordEmail = sendResetPasswordEmail;
exports.contactEmail = contactEmail
