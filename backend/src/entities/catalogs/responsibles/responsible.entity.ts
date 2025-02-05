import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
