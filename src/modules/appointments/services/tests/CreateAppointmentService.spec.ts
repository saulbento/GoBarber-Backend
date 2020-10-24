import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/respositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeNotificationsRepository = new FakeNotificationsRepository();
		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationsRepository,
		);
	});
	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 13),
			user_id: 'user_id',
			provider_id: 'provider_id',
		});

		expect(appointment).toHaveProperty('id');
	});

	it('should not be able to create two appointments at the same time', async () => {
		const appointmentDate = new Date(2021, 5, 10, 12);
		await createAppointment.execute({
			date: appointmentDate,
			user_id: 'user_id',
			provider_id: 'provider_id',
		});

		await expect(
			createAppointment.execute({
				date: new Date(2021, 5, 10, 12),
				user_id: 'user_id',
				provider_id: 'provider_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				user_id: 'user_id',
				provider_id: 'provider_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with the same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 13),
				user_id: 'user_id',
				provider_id: 'user_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8:00 and after 18:00', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2021, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2021, 4, 10, 7),
				user_id: 'user_id',
				provider_id: 'provider_id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2021, 4, 10, 18),
				user_id: 'user_id',
				provider_id: 'provider_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
