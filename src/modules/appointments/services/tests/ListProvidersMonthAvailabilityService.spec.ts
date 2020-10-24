import FakeAppointmentsRepository from '@modules/appointments/respositories/fakes/FakeAppointmentsRepository';
import ListProvidersMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProvidersMonthAvailabilityService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProvidersMonthAvailabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('Should be able to list the month availability from provider', async () => {
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 8, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 9, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 10, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 11, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 12, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 13, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 14, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 15, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 16, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 17, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 17, 8, 0, 0),
		});

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'user',
			year: 2020,
			month: 11,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ day: 10, available: true },
				{ day: 11, available: false },
				{ day: 12, available: true },
				{ day: 17, available: true },
			]),
		);
	});
});
