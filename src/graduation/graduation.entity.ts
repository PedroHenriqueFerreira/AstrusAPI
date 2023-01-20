import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
