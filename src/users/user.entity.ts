import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
