import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  imageUrl: string;

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
