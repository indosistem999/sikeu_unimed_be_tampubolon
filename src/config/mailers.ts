import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import path from 'path';
import { Edge } from 'edge.js';
import {
  I_MailAttributes,
  I_MailTemplateSender,
  I_ResultMailSender,
} from '../interfaces/app.interface';
import { Config as cfg, IsProduction } from '../constanta';
import { Logger } from './logger';

const tranportOption: any = {
  host: cfg.MailHost,
  port: cfg.MailPort,
  auth: {
    user: cfg.MailUser,
    pass: cfg.MailPass,
  },
  sender: cfg.MailFrom,
  secure: cfg.MailSecure,
  ignoreTLS: cfg.MailIgnoreTLS,
  tls: { rejectUnauthorized: false }, // Override TLS verification
};


if (IsProduction) {
  delete (tranportOption as any).secure;
  delete (tranportOption as any).ignoreTLS;
}

class MailSMTP {
  private transporter: Transporter;
  private edge: Edge;
  private mailAttributes: I_MailAttributes;

  constructor() {
    this.transporter = nodemailer.createTransport(tranportOption);

    this.edge = new Edge({ cache: false });

    this.mailAttributes = {
      from: tranportOption.sender,
      to: '',
      subject: '',
      text: '',
      attachments: '',
      additional: {},
    } as I_MailAttributes;
  }

  static init(): MailSMTP {
    return new MailSMTP();
  }

  from(param: string): this {
    this.mailAttributes.from = param;
    return this;
  }

  to(param: string): this {
    this.mailAttributes.to = param;
    return this;
  }

  cc(param: string): this {
    this.mailAttributes.cc = param;
    return this;
  }

  subject(param: string): this {
    this.mailAttributes.subject = param;
    return this;
  }

  text(param: string): this {
    this.mailAttributes.text = param;
    return this;
  }

  attachments(params: any): this {
    this.mailAttributes.attachments = params;
    return this;
  }

  config(param: any): this {
    this.transporter = nodemailer.createTransport(param);
    return this;
  }

  additional(param: Record<string, any>): this {
    this.mailAttributes.additional = param;
    return this;
  }

  async html(str: string, variable: Record<string, any> = {}): Promise<this> {
    try {
      this.edge.mount(path.join(__dirname, '../templates'));
      this.mailAttributes.html = await this.edge.render(str, variable);
    } catch (error) {
      console.error('Error rendering email template:', error);
      this.mailAttributes.html = '';
    }
    return this;
  }

  async send(): Promise<I_ResultMailSender> {
    try {
      const mailOptions: SendMailOptions = {
        from: this.mailAttributes.from,
        to: this.mailAttributes.to,
        cc: this.mailAttributes.cc,
        subject: this.mailAttributes.subject,
        text: this.mailAttributes.text,
        attachments: this.mailAttributes.attachments,
        html: this.mailAttributes.html,
        ...this.mailAttributes.additional,
      };

      const info = await this.transporter.sendMail(mailOptions);

      Logger().info(
        `${this.mailAttributes.subject.toLowerCase().replaceAll(' ', '')}.txt`,
        'mail',
        `[SENT] Subject: ${this.mailAttributes.subject}, Recipient: "${this.mailAttributes.to}".\n`
      );
      return { success: true, data: info };
    } catch (error: any) {
      console.error('Email sending failed:', error);
      Logger().error(
        `${this.mailAttributes.subject.toLowerCase().replaceAll(' ', '')}.txt`,
        'mail',
        `[FAILED] Subject: ${this.mailAttributes.subject}, Recipient: "${this.mailAttributes.to}", Message: ${error.message}.\n`
      );
      return { success: false, message: error.message };
    }
  }
}

export const execEmailSender = async (payload: I_MailTemplateSender) => {
  try {
    const mail = MailSMTP.init()
      .from(payload.sender ?? cfg.MailFrom)
      .to(payload.receiver)
      .subject(payload.subject ?? '')
      .cc(payload?.cc ?? '')
      .attachments(payload?.attachments ?? {});

    await mail.html(payload?.template, { data: payload?.data });
    await mail.send();

    console.info('Email success to send');
  } catch (error: any) {
    console.info('error email job', error);
  }
};

export default MailSMTP;
