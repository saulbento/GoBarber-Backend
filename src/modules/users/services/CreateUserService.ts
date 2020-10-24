import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '@modules/users/infra/providers/HashProvider/models/IHashProvider';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	async execute({ name, email, password }: IRequest): Promise<User> {
		const checkUserExists = await this.usersRepository.findByEmail(email);

		if (checkUserExists) {
			throw new AppError('E-mail address already used.', 401);
		}

		const hashedPassword = await this.hashProvider.generateHash(password);

		const user = this.usersRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return user;
	}
}

export default CreateUserService;
