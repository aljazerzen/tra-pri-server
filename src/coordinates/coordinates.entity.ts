import { Column } from 'typeorm';

export class Coordinates {
  @Column({ type: 'float8', nullable: true })
  lat: number;

  @Column({ type: 'float8', nullable: true })
  lng: number;
}
