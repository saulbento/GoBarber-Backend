import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		showProfile = new ShowProfileService(fakeUsersRepository);
	});
	it('Should be able to show user profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'barber',
			email: 'test@test.com',
			password: '123456',
		});

		const profile = await showProfile.execute({
			user_id: user.id,
		});

		expect(profile.name).toBe('barber');
		expect(profile.email).toBe('test@test.com');
	});

	it('Should not be able to show the profile non-existing user', async () => {
		expect(
			showProfile.execute({
				user_id: 'non-existing-user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
