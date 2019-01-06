// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { MaskSectionType } from "./mask-section-type.class";

export class MaskOptions {

  // Автоматическая корректировка значения секции. При внесении значения большего,
  // чем максимальное - заменяется максимальным, меньшего, чем минимальное -
  // минимальным.
  public autoCorrect: boolean = true;

  // При начале внесения автоматически добавляются плэйсхолдеры
  public appendPlaceholders: boolean = false;

  // Разрешить значения, внесение которых не завершено (имеются плэйсхолдеры или длина не соответствует маске)
  public allowIncomplete: boolean = false;

  // Клавиши ArrowUp и ArrowDown меняют значения на следующее и предыдущее
  public incrementDecrementValueByArrows: boolean = true;

  // Можно добавить новый тип секции
  public sectionTypes: Array<MaskSectionType> = [];

  constructor(
    public placeholder: string,        // Символ placeholder
    public replaceMode: boolean = true // Режим замены - при перемещении курсора
                                       // выделяется текущий символ
  ) {
    // ...
  }
}
