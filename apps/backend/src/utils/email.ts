import dotenv from "dotenv";
import nodemailer from "nodemailer";

//To make sure that the .env file is loaded, it's not enough in index.js
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: +(process.env.MAIL_PORT || 587),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
