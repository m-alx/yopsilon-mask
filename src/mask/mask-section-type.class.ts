// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

export class MaskSectionType {
  public selectors: Array<string> = [];
  public digits: boolean = false;
  public alpha: boolean = false;
  public min?: number = null;
  public max?: number = null;
  public options?: Array<string>;

  public regExp?: RegExp;

  // Минимальная и максимальная длина значения для тонкой настройки
  // Если это не целочисленная секция - может пригодиться
  // Minimum and maximum value length to fine-tune
  // Can be useful if section is not integer 
  public minL?: number = null;
  public maxL?: number = null;

  // Какая часть даты представляется данной секцией
  //  d - день
  //  m - месяц
  //  y - год
  //  h - час (0 - 12)
  //  H - час (0 - 24)
  //  mi - минуты
  //  s - секунды
  //  ms - миллисекунды

  // Which part of the date is represented with this section
  //  d - day
  //  m - month
  //  y - year
  //  h - hour (0 - 12)
  //  H - hour (0 - 24)
  //  mi - minutes
  //  s - seconds
  //  ms - milliseconds  
  public datePart?: string = null;
}
