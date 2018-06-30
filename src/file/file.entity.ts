import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WinePackage } from '../package/wine-package.entity';
import { Variety } from '../variety/variety.entity';
import { Label } from '../wine/label.entity';
import { Winemaker } from '../winemaker/winemaker.entity';
import { Wine } from './../wine/wine.entity';
import { FILE_TYPE } from './file.constants';

@Entity()
export class File {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  type: FILE_TYPE;

  @Column()
  path: string;

  @Column({ nullable: true })
  url: string;

  @ManyToMany(() => Winemaker, wm => wm.images)
  winemakers: Winemaker[];

  @ManyToMany(() => Variety, v => v.images)
  varieties: Variety[];

  @ManyToMany(() => Wine, v => v.images)
  wines: Wine[];

  @OneToMany(() => Label, label => label.image)
  label: Label;

  @OneToMany(() => Winemaker, v => v.video)
  winemakerVideo: Wine[];

  @OneToOne(() => WinePackage, pack => pack.file)
  winePackage: WinePackage;

  @CreateDateColumn()
  createdAt: Date
}
