import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllPRovidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
	findAllProviders(data: IFindAllPRovidersDTO): Promise<User[]>;
	findByEmail(id: string): Promise<User | undefined>;
	findById(email: string): Promise<User | undefined>;
	create(data: ICreateUserDTO): Promise<User>;
	save(user: User): Promise<User>;
}
