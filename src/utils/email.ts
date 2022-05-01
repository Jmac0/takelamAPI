
const nodeMailer = require('nodemailer');


const sendEmail = async (options: {
  subject: string;
  html: string;
  email: any;
}) => {
  // create email transport options
let transport;
  if (process.env.NODE_ENV === 'production') {
    transport = nodeMailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: '465',
      auth: {
        user: 'apikey',
        pass: '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',
      },
    });
  } else {

    transport = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  // Define email options
  const emailOptions = {
    from: process.env.FROM_EMAIL as string,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transport.sendMail(emailOptions);
};
export default sendEmail;
