import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;
describe('UpdateUserAvatar', () => {
	beforeEach(() => {
		fakeStorageProvider = new FakeStorageProvider();
		fakeUsersRepository = new FakeUsersRepository();
		updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);
	});
	it('Should be able to update a new avatar to user profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.png',
		});

		expect(user.avatar).toBe('avatar.png');
	});

	it('Should delete an existing avatar before uploading a new avatar', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.png',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar2.png',
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.png');
		expect(user.avatar).toBe('avatar2.png');
	});

	it('Should not be able to update a new avatar to an not signed in user', async () => {
		await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			updateUserAvatar.execute({
				user_id: 'non-logged-user',
				avatarFileName: 'avatar.png',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
