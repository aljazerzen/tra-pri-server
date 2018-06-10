import { Entity, Column } from "typeorm";
import { IsString, MaxLength, IsDefined } from "class-validator";
import { LocaleText, LocaleString } from "./locale.entity";

export class DLocaleText {
  @IsString()
  sl: string;

  @IsString()
  en: string;

  static create(entity: LocaleText) {
    const r = new DLocaleText();
    r.sl = entity.sl;
    r.en = entity.en;
    return r;
  }
}

export class DLocaleString {
  @IsString() @MaxLength(100)
  sl: string;

  @IsString() @MaxLength(100)
  en: string;

  static create(entity: LocaleString) {
    const r = new DLocaleString();
    r.sl = entity.sl;
    r.en = entity.en;
    return r;
  }
}
