import { Column } from 'typeorm';

export class Temperature {

  @Column({ type: 'float', nullable: true })
  from: number;

  @Column({ type: 'float', nullable: true })
  to: number;

}