import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/EmailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersTokenRepository from '@modules/users/repositories/fakes/FakeUsersTokenRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeMailProvider = new FakeMailProvider();
		fakeUsersTokenRepository = new FakeUsersTokenRepository();

		sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
			fakeUsersTokenRepository,
		);
	});

	it('Should be able to recover the password using a valid email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		await fakeUsersRepository.create({
			name: 'Barber',
			email: 'test@test.com',
			password: '123456',
		});

		await sendForgotPasswordEmail.execute({
			email: 'test@test.com',
		});

		expect(sendMail).toHaveBeenCalled();
	});

	it('Should not be able to recover the password from an invalid email', async () => {
		await expect(
			sendForgotPasswordEmail.execute({ email: 'test@test.com' }),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should generate a forgot password token', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
		const generateToken = jest.spyOn(fakeUsersTokenRepository, 'generate');

		const user = await fakeUsersRepository.create({
			name: 'Barber',
			email: 'test@test.com',
			password: '123456',
		});

		await sendForgotPasswordEmail.execute({
			email: 'test@test.com',
		});

		expect(sendMail).toHaveBeenCalled();
		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
