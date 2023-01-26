import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';
import { Graduation } from '../graduation/graduation.entity';
import { Avatar } from '../avatar/avatar.entity';
import { Role } from '../shared/roles/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Avatar, { onDelete: 'SET NULL' })
  @JoinColumn()
  avatar: Avatar;

  @OneToOne(() => Graduation)
  @JoinColumn()
  graduation: Graduation;

  @Column({ length: 64 })
  firstName: string;

  @Column({ length: 64, nullable: true })
  lastName: string;

  @Column({ length: 64 })
  email: string;

  @Column({ length: 64 })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 64, default: Role.USER })
  role: Role;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertAndUpdate() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }

    if (this.password) {
      this.password = hashSync(this.password);
    }
  }
}
