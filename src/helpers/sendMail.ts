import { MailerService } from '@nestjs-modules/mailer';

export async function sendMail(
  service: MailerService,
  email: string,
  subject: string,
  mensagem: string,
) {
  await service.sendMail({
    to: email,
    from: 'app@users.com',
    subject: subject,
    html: mensagem,
  });
}
