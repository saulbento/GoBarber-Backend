import FakeAppointmentsRepository from '@modules/appointments/respositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderDayAvailability = new ListProviderDayAvailabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('Should be able to list the day availability from provider', async () => {
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 14, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'user',
			date: new Date(2020, 10, 11, 11, 0, 0),
		});

		jest.spyOn(Date, 'now').mockImplementation(() => {
			return new Date(2020, 10, 11, 10, 0, 0).getTime();
		});

		const availability = await listProviderDayAvailability.execute({
			provider_id: 'user',
			year: 2020,
			month: 11,
			day: 11,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ hour: 8, available: false },
				{ hour: 9, available: false },
				{ hour: 11, available: false },
				{ hour: 12, available: true },
				{ hour: 13, available: true },
				{ hour: 14, available: false },
			]),
		);
	});
});
