import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Graduation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  docUrl: string;

  @Column({ length: 64, nullable: true })
  optionalDocUrl: string;

  @Column({ length: 64 })
  lattesUrl: string;

  @OneToOne(() => User, (user) => user.graduation)
  user: User;

  @Column({ default: false })
  isVerified: boolean;

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
}
