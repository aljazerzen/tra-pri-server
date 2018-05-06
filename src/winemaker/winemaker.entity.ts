import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Place } from '../place/place.entity';
import { Wine } from '../wine/wine.entity';

@Entity()
export class Winemaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  website: string;

  @Column({ type: 'text', default: '' })
  background: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  placeId: number;
  @ManyToOne(() => Place, place => place.winemakers)
  place: Place;

  @OneToMany(() => Wine, wine => wine.winemaker)
  wines: Wine[];
}
