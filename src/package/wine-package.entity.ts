import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from '../file/file.entity';

@Entity()
export class WinePackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wineCount: number;

  @CreateDateColumn()
  date: Date;

  @OneToOne(() => File, file => file.winePackage) @JoinColumn()
  file: File;

  @Column()
  size: number;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => File, file => file.winePackageModel) @JoinColumn() @Index()
  model: File;

  @OneToOne(() => File, file => file.winePackageJson) @JoinColumn()
  json: File;
}
