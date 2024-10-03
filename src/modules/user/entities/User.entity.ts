import { Role } from 'src/modules/role/entities/Role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10 })
  firstName: string;

  @Column('varchar', { length: 10 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 200 })
  address: string;

  @Column('int', { name: 'role_id' })
  roleId: number;

  @Column({ nullable: true, default: null })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  @ManyToOne(() => Role, (role) => role.users, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}