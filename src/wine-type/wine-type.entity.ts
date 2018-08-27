import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from '../file/file.entity';
import { LocaleString } from '../locale/locale.entity';
import { Wine } from '../wine/wine.entity';

@Entity()
export class WineType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => LocaleString)
  name: LocaleString;

  @OneToOne(() => File, file => file.wineType) @JoinColumn()
  image: File;

  @OneToMany(() => Wine, wine => wine.winemaker)
  wines: Wine[];
}
