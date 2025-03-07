import process from 'node:process';
import { z } from 'zod';

const MAILER_PROVIDER = z
  .enum(['nodemailer', 'resend'], {
    description:
      'The mailer provider to use. Please set the environment variable MAILER_PROVIDER to one of the following values: nodemailer, resend',
  })
  .default('nodemailer')
  .parse(process.env.MAILER_PROVIDER);

/**
 * @description Get the mailer based on the environment variable.
 */
export async function getMailer() {
  switch (MAILER_PROVIDER) {
    case 'nodemailer': {
      const { createNodemailerService } = await import('@kit/nodemailer');

      return createNodemailerService();
    }

    case 'resend': {
      const { createResendMailer } = await import('@kit/resend');

      return createResendMailer();
    }

    default:
      throw new Error(`Invalid mailer: ${MAILER_PROVIDER as string}`);
  }
}
