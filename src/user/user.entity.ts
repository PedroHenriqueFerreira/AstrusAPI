import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';
import { Graduation } from 'src/graduation/graduation.entity';
import { Avatar } from 'src/avatar/avatar.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Avatar, (avatar) => avatar.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  avatar: Avatar;

  @Column({ length: 64 })
  firstName: string;

  @Column({ length: 64, nullable: true })
  lastName: string;

  @Column({ length: 64 })
  email: string;

  @Column({ length: 64 })
  password: string;

  @OneToOne(() => Graduation, (graduation) => graduation.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  graduation: Graduation;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isMaster: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.email = this.email.toLowerCase();
    this.password = hashSync(this.password);
  }
}
