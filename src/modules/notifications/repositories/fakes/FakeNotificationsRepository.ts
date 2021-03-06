import { ObjectId } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
	private notifications: Notification[] = [];

	public async create({
		content,
		recipient_id,
	}: ICreateNotificationsDTO): Promise<Notification> {
		const notification = new Notification();

		Object.assign(notification, { id: new ObjectId(), content, recipient_id });

		this.notifications.push(notification);

		return notification;
	}
}

export default NotificationsRepository;
