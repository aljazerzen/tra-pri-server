import { Wine } from './../wine/wine.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { FILE_TYPE } from './file.constants';
import { Winemaker } from '../winemaker/winemaker.entity';
import { WinePackage } from '../package/wine-package.entity';
import { Variety } from '../variety/variety.entity';

@Entity()
export class File {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  type: FILE_TYPE;

  @Column()
  key: string;

  @Column()
  url: string;

  @ManyToMany(() => Winemaker, wm => wm.images)
  winemakers: Winemaker[];

  @ManyToMany(() => Variety, v => v.images)
  varieties: Variety[];

  @ManyToMany(() => Wine, v => v.images)
  wines: Wine[];

  @OneToMany(() => Winemaker, v => v.video)
  winemakerVideo: Wine[];

  @OneToOne(() => WinePackage, pack => pack.file)
  winePackage: WinePackage;

  @CreateDateColumn()
  createdAt: Date
}
