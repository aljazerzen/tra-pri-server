import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Coordinates } from '../coordinates/coordinates.entity';

@Entity()
export class Place {

  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  name : string;

  @Column(() => Coordinates)
  coordinates: Coordinates;

}
