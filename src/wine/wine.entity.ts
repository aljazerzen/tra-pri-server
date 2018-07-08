import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LocaleText } from '../locale/locale.entity';
import { Sugar } from '../sugar/sugar.entity';
import { Variety } from '../variety/variety.entity';
import { WineType } from '../wine-type/wine-type.entity';
import { Label } from '../wine/label.entity';
import { Winemaker } from '../winemaker/winemaker.entity';
import { File } from './../file/file.entity';
import { Temperature } from './temperature.entity';

@Entity()
export class Wine {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true })
  year: number;

  @Column(() => LocaleText)
  culinary: LocaleText;
  @Column(() => LocaleText)
  features: LocaleText;

  @Column(() => Temperature)
  temperature: Temperature;

  @Column(() => LocaleText)
  awards: LocaleText;

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

  @OneToMany(() => Label, label => label.wine)
  labels: Label[];

  // sequential number of class used in machine learning model generation for this wine 
  @Column({ nullable: true })
  classNumber: number; 
}
