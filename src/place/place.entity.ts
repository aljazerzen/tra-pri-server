import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from '../file/file.entity';
import { Winemaker } from '../winemaker/winemaker.entity';

@Entity()
export class Place {

  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  name : string;

  @OneToOne(() => File, file => file.place) @JoinColumn()
  image: File;

  @OneToMany(() => Winemaker, winemaker => winemaker.place)
  winemakers: Winemaker[];
}
