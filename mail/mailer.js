import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAILMAIL,
        pass: process.env.EMAILPASS,
    },
});

async function send(to, subject, html) {
    const info = await transporter.sendMail({
        from: 'From: ' + process.env.EMAILMAIL,
        to: to,
        subject: subject,
        html: html,
    });
    return info;
}

export default send;
