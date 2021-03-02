// import nodemailer, { Transporter } from 'nodemailer/lib/ses-transport';
// import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/EmailProvider/models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

// import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
// import ISendMailDTO from '../dtos/ISendMailDTO';

// @injectable()
export default class SESMailProvider implements IMailProvider {
	sendMail(data: ISendMailDTO): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
// 	// private client: Transporter;

// 	constructor(
// 		@inject('MailTemplateProvider')
// 		private mailTemplateProvider: IMailTemplateProvider,
// 	) {}

// 	public async sendMail({
// 		to,
// 		subject,
// 		from,
// 		templateData,
// 	}: ISendMailDTO): Promise<void> {
// 		console.log('debugou');
// 	}
// }
