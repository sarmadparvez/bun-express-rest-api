import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
