import { AccessRole } from 'src/access-control/access-control.const';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity(/* 'users' */)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, default: AccessRole.USER })
  accessRole: AccessRole;
}
