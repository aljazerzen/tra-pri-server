import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LocaleText, LocaleString } from '../locale/locale.entity';
import { Wine } from '../wine/wine.entity';
import { File } from './../file/file.entity';

@Entity()
export class Variety {

  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => LocaleString)
  name: LocaleString;

  @Column(() => LocaleText)
  description: LocaleText;

  @Column({ default: false })
  hasLocalOrigins: boolean;

  @ManyToMany(() => Wine)
  wines: Wine[];

  @ManyToMany(() => File, file => file.varieties) @JoinTable()
  images: File[];
}
