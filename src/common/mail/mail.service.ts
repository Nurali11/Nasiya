import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { config } from "src/config";
@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            pass: config.EMAIL_KEY,
            user: config.EMAIL
        },
    });

    async sendEmail(email: string, subject: string, text: string, otp?: any) {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="text-align: center; color: #1e88e5;">🔐 Nasiya — Tasdiqlash kodingiz</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Assalomu alaykum! Quyidagi bir martalik kod (OTP) sizning Nasiya hisobingizni tasdiqlash uchun kerak:
        </p>

        <div style="text-align: center; margin: 25px 0;">
            <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #1e88e5; background-color: #f1f8ff; padding: 15px 30px; border-radius: 10px;">
                ${otp}
            </span>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">
          Ushbu kod faqat 5 daqiqa davomida amal qiladi. Kodni hech kim bilan ulashmang.
        </p>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          Hurmat bilan,<br/>
          <strong>Nasiya jamoasi</strong><br/>
          <a href="https://nasiyashop.uz" target="_blank" style="color: #1e88e5; text-decoration: none;">nasiya.uz</a>
        </p>
      </div>
    `;
            let resultEmail = await this.transporter.sendMail({
                to: email,
                subject: subject,
                text: text,
                html: html,
            });

            return resultEmail

        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
