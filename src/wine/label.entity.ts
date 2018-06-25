import { Entity, ManyToOne, OneToOne, JoinColumn, Column, PrimaryColumn, RelationId } from "typeorm";
import { Wine } from "../wine/wine.entity";
import { File } from "../file/file.entity";

@Entity()
export class Label {

  @PrimaryColumn()
  index: number;

  @PrimaryColumn() @RelationId((label: Label) => label.wine)
  wineId: number;

  @PrimaryColumn() @RelationId((label: Label) => label.image)
  imageId: number;

  @ManyToOne(() => Wine, wine => wine.labels)
  wine: Wine;

  @ManyToOne(() => File, file => file.label)
  image: File;

  @Column({ array: true, type: 'int', nullable: true })
  coordinates: number[];
  // top-left, top-center, top-right, bottom-right, bottom-center, bottom-left
}