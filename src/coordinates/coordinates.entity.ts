import { Column } from 'typeorm';

export class Coordinates {
  @Column('float8')
  lat: number;

  @Column('float8')
  lng: number;
}
