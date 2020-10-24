import { container } from 'tsyringe';

import '@modules/users/infra/providers';
import './providers';

import IAppointmentsRepository from '@modules/appointments/respositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import UsersTokenRepository from '@modules/users/infra/typeorm/repositories/UsersTokenRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppointmentsRepository>(
	'AppointmentsRepository',
	AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
	'UsersRepository',
	UsersRepository,
);

container.registerSingleton<IUsersTokenRepository>(
	'UsersTokenRepository',
	UsersTokenRepository,
);

container.registerSingleton<INotificationsRepository>(
	'NotificationsRepository',
	NotificationsRepository,
);
