import { inject, injectable } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import IMailProvider from '@shared/container/providers/EmailProvider/models/IMailProvider';
// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
	email: string;
}

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('MailProvider')
		private mailProvider: IMailProvider,

		@inject('UsersTokenRepository')
		private userTokenRepository: IUsersTokenRepository,
	) {}

	async execute({ email }: IRequest): Promise<void> {
		const checkUserExists = await this.usersRepository.findByEmail(email);

		if (!checkUserExists) {
			throw new AppError('Only valid e-mails can be used to recover password');
		}

		const { token } = await this.userTokenRepository.generate(
			checkUserExists.id,
		);

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'..',
			'views',
			'forgot_password.hbs',
		);

		await this.mailProvider.sendMail({
			to: {
				name: checkUserExists.name,
				email: checkUserExists.email,
			},
			subject: '[GoBarber] Password Recovery',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: checkUserExists.name,
					link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
				},
			},
		});
	}
}

export default SendForgotPasswordEmailService;
