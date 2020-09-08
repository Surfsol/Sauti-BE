const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORDFROM
  }
});

const sendResetPasswordEmail = (user, code, url) => {
  transporter.sendMail({
    from: "Databank Sauti Africa <tradeinsights.sautiafrica@gmail.com>",
    to: `${user.email}`,
    subject: "Code Verification - NO REPLY",
    text: "For clients with plaintext support only",
    html: `<p>Hello ${user.email}, <br /> Your verifcation code to reset your password is <b>${code}</b>. <br /> Please visit <a href="${url}">Password Reset Verification Link</a> to reset your password.  </p>`
  });
};

const contactEmail = input => {
  console.log('in contactEmail')
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
}


exports.sendResetPasswordEmail = sendResetPasswordEmail;
exports.contactEmail = contactEmail
