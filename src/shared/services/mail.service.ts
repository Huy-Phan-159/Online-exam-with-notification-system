import { ConfigService } from "@nestjs/config";
import { ApiConfigService } from "./api-config.service";
import * as nodemailer from 'nodemailer';
import { MailDTO } from "../interfaces/mail.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ApiConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getString('MAIL_HOST'),
      port: this.configService.getNumber('MAIL_PORT'),
      secure: false, // true for port 465, false for other ports
      auth: {
        user: this.configService.getString('MAIL_USER'),
        pass: this.configService.getString('MAIL_PASSWORD')
      }
    });
  }
  async sendMail(dto:MailDTO) {
    await this.transporter.sendMail(dto);
  }
}