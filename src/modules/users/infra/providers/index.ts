import { container } from 'tsyringe';

import IHashProvider from '@modules/users/infra/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/infra/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
