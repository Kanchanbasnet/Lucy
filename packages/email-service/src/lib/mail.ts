import nodemailer from 'nodemailer'
import type { EmailConfig, SendEmailOptions } from '@repo/types';
import { compileEmailTemplate } from './templates';

export class EmailService {
    private transporter: nodemailer.Transporter;


    constructor(config: EmailConfig) {
        this.transporter = nodemailer.createTransport({
            service: config.service,
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        })

    }

    async sendEmail(options: SendEmailOptions) {
        try {
            const { from, to, subject, html, text, context, template } = options;
            let emailHtml;
            if (template) {
                emailHtml = await compileEmailTemplate(template, context || {})

            }
            else if (html) {
                emailHtml = html;
            }
            else if (text) {
                emailHtml = text
            }
            else {
                throw new Error('Either template, html, or text must be provided');
            }
            const info = await this.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: emailHtml,
                text: text,


            })
            return {
                message: "Email Sent successfully",
                messageId: info.messageId
            }

        }
        catch (error) {
            throw new Error('Failed to send email');

        }
    }


}