import nodemailer from "nodemailer";
import { env } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";

const transport = nodemailer.createTransport({
    secure: false,
    auth: {
        user: env.EMAIL_SENDER.SMTP_USER,
        pass: env.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(env.EMAIL_SENDER.SMTP_PORT),
    host: env.EMAIL_SENDER.SMTP_HOST
});

interface ISendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData?: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
};

const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: ISendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);

        const info = await transport.sendMail({
            from: env.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });

        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        console.log("Email sending error", error.message);
        throw new AppError(401, "Email error");
    };
};

export default sendEmail;