import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wine } from '../wine/wine.entity';

@Entity()
export class Sugar {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Wine, wine => wine.winemaker)
  wines: Wine[];
}
