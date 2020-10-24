import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticaUserService from '@modules/users/services/AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUser: AuthenticaUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		authenticateUser = new AuthenticaUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});
	it('Should be able to authenticate an existing user', async () => {
		const user = await createUserService.execute({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		const session = await authenticateUser.execute({
			email: 'test@test.com',
			password: '123456',
		});

		expect(session).toHaveProperty('token');
		expect(session.user).toEqual(user);
	});

	it('Should not be able to authenticate an user with wrong e-mail', async () => {
		await createUserService.execute({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			authenticateUser.execute({
				email: 'test1@test.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('Should be able to authenticate an existing user', async () => {
		await createUserService.execute({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			authenticateUser.execute({
				email: 'test@test.com',
				password: '123457',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
