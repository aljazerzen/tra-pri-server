import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => File, file => file.winePackageModel) @JoinColumn()
  model: File;
}
