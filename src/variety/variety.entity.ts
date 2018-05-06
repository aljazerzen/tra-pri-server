import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wine } from '../wine/wine.entity';

@Entity()
export class Variety {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: false })
  hasLocalOrigins: boolean;

  @ManyToMany(() => Wine)
  wines: Wine[];
}
