import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wine } from '../wine/wine.entity';
import { LocaleString } from '../locale/locale.entity';

@Entity()
export class WineType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => LocaleString)
  name: LocaleString;

  @OneToMany(() => Wine, wine => wine.winemaker)
  wines: Wine[];
}
