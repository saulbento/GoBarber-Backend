import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from '@shared/container/providers/EmailProvider/models/IMailProvider';
import emailProvider from '@shared/container/providers/EmailProvider';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider//implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
	'StorageProvider',
	DiskStorageProvider,
);

container.registerInstance<IMailTemplateProvider>(
	'MailTemplateProvider',
	new HandlebarsMailTemplateProvider(),
);

container.registerInstance<IMailProvider>(
	'MailProvider',
	container.resolve(emailProvider[mailConfig.driver]),
);
