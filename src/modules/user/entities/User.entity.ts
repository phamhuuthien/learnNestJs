import { Role } from 'src/modules/role/entities/Role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 10 })
  firstName: string;

  @Column("varchar", { length: 10 })
  lastName: string;

  @Column({type: "varchar",length: 100,unique: true,})
  email: string;

  @Column("varchar", { length: 255 })
  password: string;

  @Column("varchar", { length: 200 })
  address: string;

  @Column("varchar", { length: 255, default: "" })
  refreshToken: string;

  @Column("int", {name: "role_id"})
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users,{ eager: false } ) 
  @JoinColumn({ name: "role_id" }) 
  role: Role
}