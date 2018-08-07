import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';

import { File } from '../file/file.entity';
import { Wine } from '../wine/wine.entity';

@Entity()
export class Label {

  @PrimaryColumn()
  index: number;

  @PrimaryColumn() @RelationId((label: Label) => label.wine)
  wineId: number;

  @PrimaryColumn() @RelationId((label: Label) => label.image)
  imageId: number;

  @ManyToOne(() => Wine, wine => wine.labels, { onDelete: 'CASCADE' })
  wine: Wine;

  @ManyToOne(() => File, file => file.label)
  image: File;

  @Column({ array: true, type: 'int', nullable: true })
  coordinates: number[];
  // top-left, top-center, top-right, bottom-right, bottom-center, bottom-left
}