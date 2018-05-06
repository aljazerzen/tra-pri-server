import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wine {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', default: '' })
  culinary: string;
  @Column({ type: 'text', default: '' })
  temperature: string;
  @Column({ type: 'text', default: '' })
  features: string;

  @Column({ type: 'text', default: '' })
  awards: string;

  // @Column('text')
  // winemakerId: string;

  // @Column('text')
  // typeid: string;

  // @Column('text')
  // sugarid: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;
  @Column('decimal')
  volume: number;
  @Column('decimal')
  abv: number;
  @Column({ nullable: true })
  code: string;
}
