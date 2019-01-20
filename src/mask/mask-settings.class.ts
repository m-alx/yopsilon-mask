// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { MaskSectionType } from "./mask-section-type.class";

export class MaskSettings {

  // Автоматическая корректировка значения секции. При внесении значения большего,
  // чем максимальное - заменяется максимальным, меньшего, чем минимальное -
  // минимальным.

  // Autocorrection of section's value. If value entered is bigger than
  // Maximum - replaced with maxValue, if less than minimum - with minValue. 
  public autoCorrect: boolean = true;

  // При начале внесения автоматически добавляются плэйсхолдеры
  // On start of input placeholders are added automatically
  public appendPlaceholders: boolean = true;

  // Разрешить значения, внесение которых не завершено (имеются плэйсхолдеры или длина не соответствует маске)
  // Allow values, for which input had not been completed (placeholders are present or length doesn't comply to a mask)
  public allowIncomplete: boolean = false;

  // Клавиши ArrowUp и ArrowDown меняют значения на следующее и предыдущее
  // ArrowUp and ArrowDown keys change values to previous and next
  public incrementDecrementValueByArrows: boolean = true;

  // Если включена эта опция, то при переходе на незаполненную секцию с заданными
  // вариантами значений, автоматически подставится первое значение из списка вариантов
  // If set to true, moving to an icnomplete section with predefined set of values,
  // first value of the set will be entered automatically
  public defaultOptions: boolean = true;

  // Можно добавить новый тип секции
  // New type of section can be added
  public sectionTypes: Array<MaskSectionType> = [];

  constructor(
    public placeholder: string,        // Символ placeholder // Placeholder char
    public replaceMode: boolean = true // Режим замены - при перемещении курсора //replace mode - on carriage position change
                                       // выделяется текущий символ //current char is selected
  ) {
    // ...
  }
}
