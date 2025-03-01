import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

async function sendMail(receiver, subject, text="", html="") {
    const info = await transporter.sendMail({
        from: "warrantyIT",
        to: receiver,
        subject,
        text,
        html,
    });

    return true;
}

export {sendMail};