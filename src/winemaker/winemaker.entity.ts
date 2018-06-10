import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, OneToOne } from 'typeorm';
import { Place } from '../place/place.entity';
import { Wine } from '../wine/wine.entity';
import { File } from '../file/file.entity';
import { LocaleString, LocaleText } from '../locale/locale.entity';

@Entity()
export class Winemaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => LocaleString)
  name: LocaleText;

  @Column({ type: 'varchar', length: 300, nullable: true })
  website: string;

  @ManyToMany(() => File, file => file.winemakers) @JoinTable()
  images: File[];

  @ManyToOne(() => File, v => v.winemakerVideo)
  video: File;

  @Column(() => LocaleText)
  background: LocaleText;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  placeId: number;
  @ManyToOne(() => Place, place => place.winemakers)
  place: Place;

  @OneToMany(() => Wine, wine => wine.winemaker)
  wines: Wine[];
}
