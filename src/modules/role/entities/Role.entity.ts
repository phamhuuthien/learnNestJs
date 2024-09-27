import { Permission } from 'src/modules/permission/entities/Permission.entity';
import { User } from 'src/modules/user/entities/User.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar",length: 100,unique: true,})
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[]

  @ManyToMany(() => Permission, (permission) => permission.roles) 
  @JoinTable(
    {
      name: "role_permission", 
      joinColumn: {
          name: "roleID", 
          referencedColumnName: "id"
      },
      inverseJoinColumn: {
          name: "permissionID",
          referencedColumnName: "id"
      }
    }
  )
  permissions: Permission[]
} 