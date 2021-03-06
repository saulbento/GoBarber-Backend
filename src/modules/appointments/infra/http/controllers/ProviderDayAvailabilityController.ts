import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { provider_id } = request.params;
		const { year, month, day } = request.body;

		const listProviderDayAvailabilityService = container.resolve(
			ListProviderDayAvailabilityService,
		);

		const dayAvailability = await listProviderDayAvailabilityService.execute({
			provider_id,
			day,
			month,
			year,
		});

		return response.json(dayAvailability);
	}
}
