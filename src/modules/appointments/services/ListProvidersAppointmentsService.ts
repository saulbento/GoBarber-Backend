import { inject, injectable } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../respositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	day: number;
	month: number;
	year: number;
}

type IResponse = Array<{
	day: number;
	available: boolean;
}>;

@injectable()
class ListProvidersAppointmentsService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({
		provider_id,
		day,
		month,
		year,
	}: IRequest): Promise<Appointment[]> {
		const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
			{
				provider_id,
				day,
				month,
				year,
			},
		);

		return appointments;
	}
}

export default ListProvidersAppointmentsService;
