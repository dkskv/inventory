import { identity } from 'lodash';
import { InventoryRecord } from 'src/entities/inventory/inventory-records/inventory-record.entity';
import { User } from 'src/entities/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', precision: 3 })
  timestamp: Date;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' })
  author: User | null;

  @ManyToOne(() => InventoryRecord, { eager: true, onDelete: 'CASCADE' })
  inventoryRecord: InventoryRecord;

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attribute: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    /* typeorm выполняет парсинг jsonb данных, нет API для отключения этого поведения,
    поэтому используется transformer */
    transformer: { to: identity, from: JSON.stringify },
  })
  prevValue: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    transformer: { to: identity, from: JSON.stringify },
  })
  nextValue: string | null;
}
