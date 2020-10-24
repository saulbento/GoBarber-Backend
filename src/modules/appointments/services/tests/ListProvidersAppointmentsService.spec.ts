import FakeAppointmentsRepository from '@modules/appointments/respositories/fakes/FakeAppointmentsRepository';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersAppointmentsService: ListProvidersAppointmentsService;

describe('ListProviderAppointments', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProvidersAppointmentsService = new ListProvidersAppointmentsService(
			fakeAppointmentsRepository,
		);
	});

	it('Should be able to list appointments on a specific day for a provider', async () => {
		const appointment1 = await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user',
			date: new Date(2020, 10, 11, 14, 0, 0),
		});

		const appointment2 = await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user',
			date: new Date(2020, 10, 11, 11, 0, 0),
		});

		const appointments = await listProvidersAppointmentsService.execute({
			provider_id: 'provider_id',
			year: 2020,
			month: 11,
			day: 11,
		});

		expect(appointments).toEqual([appointment1, appointment2]);
	});
});
