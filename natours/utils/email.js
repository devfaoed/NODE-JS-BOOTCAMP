import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1dbd11b1b20c70",
      pass: "50fc13d0c04f66"
    },
  });
  // define emails options
  const mailOptions = {
    from: 'Adedokun Faith <adedokunfaith3@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send the mail
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
