import { z } from 'zod';

import { Mailer, MailerSchema } from '@kit/mailers-shared';

import { getSMTPConfiguration } from './smtp-configuration';

type Config = z.infer<typeof MailerSchema>;

export function createNodemailerService() {
  return new Nodemailer();
}

/**
 * A class representing a mailer using Nodemailer library.
 * @implements {Mailer}
 */
class Nodemailer implements Mailer {
  async sendEmail(config: Config) {
    const { createTransport } = await import('nodemailer').catch();
    const transporter = createTransport(getSMTPConfiguration());

    return transporter.sendMail(config);
  }
}
