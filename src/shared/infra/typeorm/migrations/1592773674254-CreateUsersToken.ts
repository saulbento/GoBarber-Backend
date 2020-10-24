import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsersToken1592773674254
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'userTokens',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'token',
						type: 'varchar',
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'user_id',
						type: 'varchar',
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'now()',
					},
				],
				foreignKeys: [
					{
						name: 'TokenUser',
						referencedTableName: 'users',
						referencedColumnNames: ['id'],
						columnNames: ['user_id'],
						onDelete: 'Cascade',
						onUpdate: 'Cascade',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('userTokens');
	}
}
