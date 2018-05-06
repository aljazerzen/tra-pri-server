import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coordinates } from '../coordinates/coordinates.entity';
import { Winemaker } from '../winemaker/winemaker.entity';

@Entity()
export class Place {

  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  name : string;

  @Column(() => Coordinates)
  coordinates: Coordinates;

  @OneToMany(() => Winemaker, winemaker => winemaker.place)
  winemakers: Winemaker[];
}
