import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_ADDRESS, MAIL_AUTH_CODE } from 'env.local';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = createTransport({
            host: this.configService.get('nodemailer_host'),
            secure: false,
            port: this.configService.get('nodemailer_port'),
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
