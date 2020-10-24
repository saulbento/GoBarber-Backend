import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		listProviders = new ListProvidersService(fakeUsersRepository);
	});
	it('Should be able to list all providers, except the user', async () => {
		const user1 = await fakeUsersRepository.create({
			name: 'barber',
			email: 'barber@test.com',
			password: '123456',
		});

		const user2 = await fakeUsersRepository.create({
			name: 'The barber',
			email: 'thebarber@test.com',
			password: '123456',
		});

		const loggedUser = await fakeUsersRepository.create({
			name: 'Red Barber',
			email: 'redbarber@test.com',
			password: '123456',
		});

		const providers = await listProviders.execute({
			user_id: loggedUser.id,
		});

		expect(providers).toEqual([user1, user2]);
	});
});
