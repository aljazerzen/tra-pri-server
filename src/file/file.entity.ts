import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { FILE_TYPE } from './file.constants';
import { Winemaker } from '../winemaker/winemaker.entity';

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

  @CreateDateColumn()
  createdAt: Date
}
