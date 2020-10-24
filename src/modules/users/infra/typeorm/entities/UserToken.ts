import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Generated,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('userTokens')
class UserToken {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	@Generated('uuid')
	token: string;

	@Column()
	user_id: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default UserToken;
