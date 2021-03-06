import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/EmailProvider/models/IMailProvider';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
	private client: Transporter;

	constructor(
		@inject('MailTemplateProvider')
		private mailTemplateProvider: IMailTemplateProvider,
	) {
		nodemailer.createTestAccount().then(account => {
			const transporter = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			});

			this.client = transporter;
		});
	}

	public async sendMail({
		to,
		subject,
		from,
		templateData,
	}: ISendMailDTO): Promise<void> {
		const message = await this.client.sendMail({
			from: {
				name: from?.name || 'Team GoBarber',
				address: from?.email || 'team@gobarber.com',
			},
			to: {
				name: to.name,
				address: to.email,
			},
			subject,
			html: await this.mailTemplateProvider.parse(templateData),
		});

		console.log('Message sent: %s', message.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
	}
}
