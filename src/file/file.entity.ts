import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { FILE_TYPE } from './file.constants';
import { Winemaker } from '../winemaker/winemaker.entity';
import { WinePackage } from '../package/wine-package.entity';

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
  winemakers: Winemaker;

  @OneToOne(() => WinePackage, pack => pack.file)
  winePackage: WinePackage;

  @CreateDateColumn()
  createdAt: Date
}
