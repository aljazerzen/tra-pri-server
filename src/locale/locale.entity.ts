import { Entity, Column, BeforeUpdate } from "typeorm";

export class LocaleText {

  @Column({ type: 'text', default: '' })
  sl: string;

  @Column({ type: 'text', default: '' })
  en: string;

}

export class LocaleString {

  @Column({ default: '', type: 'varchar', length: 100 })
  sl: string;

  @Column({ default: '', type: 'varchar', length: 100 })
  en: string;
  
}