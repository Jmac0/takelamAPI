const nodeMailer = require('nodemailer');

interface EmailOptions {
  email: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: EmailOptions) => {
  // create email transport options
  const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,

  }});

  // Define email options
  const emailOptions = {
    from: 'testUser hello@takelam.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  await transporter.sendMail(emailOptions);
};
export default sendEmail;
