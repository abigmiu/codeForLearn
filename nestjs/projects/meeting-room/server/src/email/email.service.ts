import { Injectable } from '@nestjs/common';
import { MAIL_ADDRESS, MAIL_AUTH_CODE } from 'env.local';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: 'smtp.qq.com',
            secure: false,
            port: 587,
            auth: {
                user: MAIL_ADDRESS,
                pass: MAIL_AUTH_CODE,
            },
        });
    }

    async sendMail({ to, subject, html }) {
        await this.transporter.sendMail({
            from: {
                name: '会议室预订系统',
                address: MAIL_ADDRESS,
            },
            to,
            subject,
            html,
        });
    }
}
