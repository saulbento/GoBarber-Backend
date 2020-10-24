import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfileService', () => {
	beforeEach(() => {
		fakeHashProvider = new FakeHashProvider();
		fakeUsersRepository = new FakeUsersRepository();
		updateProfile = new UpdateProfileService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});
	it('Should be able to update user profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'The Barber',
			email: 'thebarber@barber.com',
		});

		expect(updatedUser.name).toBe('The Barber');
		expect(updatedUser.email).toBe('thebarber@barber.com');
	});

	it('Should not be able to update e-mail to an existent e-mail', async () => {
		await fakeUsersRepository.create({
			name: 'barber',
			email: 'thebarber@barber.com',
			password: '123456',
		});

		const user = await fakeUsersRepository.create({
			name: 'teste',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'The Barber',
				email: 'thebarber@barber.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'The Barber',
			email: 'thebarber@barber.com',
			old_password: '123456',
			password: '123123',
		});

		expect(updatedUser.password).toBe('123123');
	});

	it('Should not be able to update the password, without informing the old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'The Barber',
				email: 'thebarber@barber.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to update the password, without informing the correct old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'The Barber',
				email: 'thebarber@barber.com',
				old_password: 'oldpass',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to update the profile non-existing user', async () => {
		expect(
			updateProfile.execute({
				user_id: 'non-existing-user-id',
				name: 'Non-exixting-name',
				email: 'test@test.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
