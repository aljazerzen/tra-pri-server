import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, OneToOne } from 'typeorm';
import { Place } from '../place/place.entity';
import { Wine } from '../wine/wine.entity';
import { File } from '../file/file.entity';

@Entity()
export class Winemaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  website: string;

  @ManyToMany(() => File, file => file.winemakers) @JoinTable()
  images: File[];

  @ManyToOne(() => File, v => v.winemakerVideo)
  video: File;

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
