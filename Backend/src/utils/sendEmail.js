import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {

  try {
    const info = await getTransporter().sendMail({
      from: `"SponsorSync" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    // console.log('Email Sent: ',info);
    
    return info;
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send email');
  }
};

export { sendEmail };