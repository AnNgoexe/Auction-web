import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  EXPIRES_IN_MINUTES,
  MailSubjects,
  MailTitles,
  MailType,
  MailTemplates,
} from '@common/constants/mail.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(to: string, otpCode: string, type: MailType): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM');
    const subject = MailSubjects[type];
    const title = MailTitles[type];
    const template = MailTemplates[type];

    const context = {
      title,
      otpCode,
      expireMinutes: EXPIRES_IN_MINUTES,
    };

    await this.mailerService.sendMail({
      from,
      to,
      subject,
      template,
      context,
    });
  }
}
