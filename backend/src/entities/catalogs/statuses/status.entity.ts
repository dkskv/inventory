import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', length: 7 })
  color: string;
}
