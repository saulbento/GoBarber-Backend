import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import IHashProvider from '@modules/users/infra/providers/HashProvider/models/IHashProvider';
// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
	token: string;
	password: string;
}

@injectable()
class ResetPasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('UsersTokenRepository')
		private usersTokenRepository: IUsersTokenRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ token, password }: IRequest): Promise<void> {
		const userToken = await this.usersTokenRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('Invalid user token');
		}
		const user = await this.usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User does not exists');
		}

		const tokenCreatedAt = userToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2);

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token Expired');
		}

		user.password = await this.hashProvider.generateHash(password);

		await this.usersRepository.save(user);
	}
}

export default ResetPasswordService;
