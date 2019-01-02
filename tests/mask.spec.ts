// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Internationalization } from "../src/internationalization/internationalization.class";
import { MaskSection, MaskSectionKeyResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { MaskOptions } from "../src/mask/mask-options.class";
import { Mask } from "../src/mask/mask.class";
import { async } from '@angular/core/testing';

describe(`Нажатие [ArrowRight] с selLength=0 при значении [13.12.2018] перед [018]: `, () => {
  let res: MaskSectionKeyResult;

  beforeEach(async(() => {
    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "mm/dd/yyyy";
    res = mask.applyKeyAtPos("12/12/2018", "ArrowRight", 7, 7);
  }));

  it(`Положение курсора должно остаться 7`, () => expect(res.newSelStart).toBe(7));
  it(`SelLength должна стать 1`, () => expect(res.newSelLength).toBe(1));
});

describe(`Опция AppendPlaceholders=true: `, () => {
  let res: MaskSectionKeyResult;
  let opt: MaskOptions;

  beforeEach(async(() => {

    let opt = new MaskOptions("_", true);
    opt.appendPlaceholders = true;
    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "mm/dd/yyyy";
    mask.options = opt;
    res = mask.applyKeyAtPos("", "1", 0, 0);
  }));

  it(`Маска mm/dd/yyyy. Нажимаем 1 при пустой строке. Новое значение должно быть 1_/__/____`, () => expect(res.newValue).toBe("1_/__/____"));
});


describe(`Маска с переменной длиной секции (255.255.255.0): `, () => {
  let res: MaskSectionKeyResult;
  let opt: MaskOptions;

  beforeEach(async(() => {

    let opt = new MaskOptions("_", true);
    opt.appendPlaceholders = false;
    // opt.placeholder = "_";

    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "b.b.b.b";
    mask.options = opt;
    res = mask.applyKeyAtPos("255.255.255.0", "Backspace", 3, 0);
  }));

  it(`Бэкспэйсим последний символ первой секции. Должно быть 25.255.255.0`, () => expect(res.newValue).toBe("25.255.255.0"));
});

describe(`Символ разделителя в пустой секции должен игнорироваться: `, () => {
  let res: MaskSectionKeyResult;
  let opt: MaskOptions;

  beforeEach(async(() => {

    let opt = new MaskOptions("_", true);
    opt.appendPlaceholders = false;
    // opt.placeholder = "_";

    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "b.b.b.b";
    mask.options = opt;
    res = mask.applyKeyAtPos("172. . . ", ".", 4, 0);
  }));

  it(`Впечатываем точку. Должно остаться 172. . . `, () => expect(res.newValue).toBe("172. . . "));
  it(`Курсор должен остаться на месте`, () => expect(res.newSelStart).toBe(4));
});

describe(`Соответствие строки маске:`, () => {

  //
  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "dd.MM.yyyy";

  it(`Значение 13.12.1979 соответствует маске`, () => expect(mask.checkMask("13.12.1979")).toBeTruthy());
  it(`Значение 13.12.197 НЕ соответствует маске`, () => expect(mask.checkMask("13.12.197")).toBeFalsy());

  it(`Значение 13._2.1979 НЕ соответствует маске`, () => expect(mask.checkMask("13._2.1979")).toBeFalsy());
  it(`Значение 13.AA.1979 НЕ соответствует маске`, () => expect(mask.checkMask("13.AA.1979")).toBeFalsy());
});

describe(`Кастомная секция, regular expression`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);

  Mask.sectionTypes.push(
    { selectors: ["A"], digits: true, alpha: true, regExp: /[a-b]/i },
  );
  mask.mask = "ANNN";
  let res: MaskSectionKeyResult;


  it(`Первый символ A или B или C: символ D нелья применить`, () => expect(mask.applyKeyAtPos("", "D", 0, 0)).toBe(null));
  it(`Первый символ A или B или C: при нажатии A значение становится равным A `, () => expect(mask.applyKeyAtPos("", "A", 0, 0).newValue).toBe("A"));
});
