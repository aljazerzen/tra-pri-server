import { File } from './../file/file.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Winemaker } from '../winemaker/winemaker.entity';
import { WineType } from '../wine-type/wine-type.entity';
import { Sugar } from '../sugar/sugar.entity';
import { Variety } from '../variety/variety.entity';

@Entity()
export class Wine {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', default: '' })
  culinary: string;
  @Column({ type: 'text', default: '' })
  temperature: string;
  @Column({ type: 'text', default: '' })
  features: string;

  @Column({ type: 'text', default: '' })
  awards: string;

  @Column({ nullable: true })
  winemakerId: number;
  @ManyToOne(() => Winemaker, winemaker => winemaker.wines)
  winemaker: Winemaker;

  @Column({ nullable: true })
  typeId: number;
  @ManyToOne(() => WineType, type => type.wines)
  type: WineType;

  @Column({ nullable: true })
  sugarId: number;
  @ManyToOne(() => Sugar, sugar => sugar.wines)
  sugar: Sugar;

  @ManyToMany(() => File, file => file.wines) @JoinTable()
  images: File[];

  @ManyToMany(() => Variety) @JoinTable()
  varieties: Variety[];

  @Column({ type: 'decimal', nullable: true })
  price: number;
  @Column('decimal')
  volume: number;
  @Column('decimal')
  abv: number;
  @Column({ nullable: true })
  code: string;
}
