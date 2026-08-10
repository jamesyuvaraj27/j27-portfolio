import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  }

  return transporter;
};

export const sendContactEmail = async ({ name, email, subject, message, rating, source }) => {
  const mailer = getTransporter();
  if (!mailer) return; // email notifications are optional

  await mailer.sendMail({
    from: `"J27 Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: subject || `New ${source === "contact" ? "contact form" : "pricing"} message from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      rating ? `Rating: ${rating}/5` : null,
      `Source: ${source}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
};
