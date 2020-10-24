import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});
	it('Should be able to create a new user', async () => {
		const user = await createUserService.execute({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		expect(user).toHaveProperty('id');
	});

	it('Should not be able to create a new user, with an existing e-mail on database', async () => {
		await createUserService.execute({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			createUserService.execute({
				name: 'barber',
				email: 'test@test.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
