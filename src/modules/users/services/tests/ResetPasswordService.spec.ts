import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '@modules/users/repositories/fakes/FakeUsersTokenRepository';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '../ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeUsersTokenRepository = new FakeUsersTokenRepository();
		fakeHashProvider = new FakeHashProvider();
		resetPassword = new ResetPasswordService(
			fakeUsersRepository,
			fakeUsersTokenRepository,
			fakeHashProvider,
		);
	});

	it('Should be able to reset the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Barber',
			email: 'test@test.com',
			password: '123456',
		});

		const { token } = await fakeUsersTokenRepository.generate(user.id);

		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

		await resetPassword.execute({
			password: '123123',
			token,
		});

		const updatedUser = await fakeUsersRepository.findById(user.id);

		expect(updatedUser?.password).toBe('123123');
		expect(generateHash).toHaveBeenCalledWith('123123');
	});

	it('Should not be able to reset the password from an invalid token', async () => {
		await expect(
			resetPassword.execute({
				password: '123123',
				token: 'invalid-token',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to reset the password from an invalid user', async () => {
		const { token } = await fakeUsersTokenRepository.generate('invalid-user');

		await expect(
			resetPassword.execute({
				password: '123123',
				token,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to reset the password if request timed out (2 hours)', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Barber',
			email: 'test@test.com',
			password: '123456',
		});

		const { token } = await fakeUsersTokenRepository.generate(user.id);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date();

			return customDate.setHours(customDate.getHours() + 3);
		});

		await expect(
			resetPassword.execute({
				password: '123123',
				token,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
