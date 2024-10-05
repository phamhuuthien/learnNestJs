import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  category: string;
}
