import { Column } from 'typeorm';

export class Temperature {

  @Column({ type: 'double precision', nullable: true })
  from: number;

  @Column({ type: 'double precision', nullable: true })
  to: number;

}