// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Internationalization } from "../src/internationalization/internationalization.class";
import { MaskSection } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { MaskOptions } from "../src/mask/mask-options.class";
import { Mask } from "../src/mask/mask.class";
import { async } from '@angular/core/testing';

describe(`MaskValue [dd.mm.yyyy] - split second section of "13.12.2018": `, () => {
  let maskValue: any;

  beforeEach(async(() => {
    let intl = new Internationalization();
    let options = new MaskOptions(" ");
    let m: Mask = new Mask(intl);
    let sType = m.selectSectionType("mm");

    let section = new MaskSection(intl, options, "mm", ".", sType);

    maskValue = section.extractSectionValue("13.12.2018", 3, 4, 0);
  }));

  it(`beforeValue should be equal "13."`, () => expect(maskValue.beforeValue).toBe("13."));
  it(`sectionValue should be equal "12"`, () => expect(maskValue.sectionValue.value()).toBe("12"));
  it(`delimiter should be equal "."`, () => expect(maskValue.delimiter).toBe("."));
  it(`afterValue should be equal "2018"`, () => expect(maskValue.afterValue).toBe("2018"));
  it(`nextPos should be equal 6`, () => expect(maskValue.nextSectionPos()).toBe(6));

  it(`Начало секции перед курсором должно быть 1`, () => expect(maskValue.sectionValue.beforeChars).toBe("1"));
  it(`Символ на позиции курсора должен быть 2`, () => expect(maskValue.sectionValue.currentChar).toBe("2"));
});

describe(`MaskValue [mm/dd/yyyy] - apply key '3' with selStart=3 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new Internationalization();

    let mask = new Mask(intl);

    mask.mask = "mm/dd/yyyy";
    let section = mask.sections[1];
    res = section.applyKey('12/', '3', 3, 3, 0);
  }));

  it(`Новое значение маски должно быть 12/3`, () => expect(res.newValue).toBe("12/3"));
  it(`Новая позиция курсора должна быть 4`, () => expect(res.newSelStart).toBe(4));
});

describe(`MaskValue [mm/dd/yyyy] - apply key '/' with selStart=1: `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new Internationalization();
    let options = new MaskOptions(" ");
    options.appendPlaceholders = false;


    let mask = new Mask(intl);
    mask.mask = "mm/dd/yyyy";
    let section = mask.sections[1];
    res = section.applyKey('1', '/', 0, 1, 0, true);
  }));

  it(`Новое значение маски должно быть 01/`, () => expect(res.newValue).toBe("01/"));
  it(`Новая позиция курсора должна быть 3`, () => expect(res.newSelStart).toBe(3));
});

describe(`MaskValue [dd mmm yyyy] - apply key 'd' on value '13 ' with selStart=3 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "dd mmm yyyy";
    let section = mask.sections[1];
    res = section.applyKey('13 ', 'd', 3, 3, 0);
  }));

  it(`Новое значение маски должно быть 13 dec`, () => expect(res.newValue).toBe("13 dec"));
  it(`Новая позиция курсора должна быть 4`, () => expect(res.newSelStart).toBe(4));
});

describe(`MaskValue [dd mmm yyyy] - apply key 'Delete' on 13 dec 1979  with selStart=10 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new Internationalization();
    let mask = new Mask(intl);
    mask.mask = "dd mmm yyyy";
    let section = mask.sections[2];
    res = section.applyKey('13 dec 1979', 'Delete', 7, 10, 0);
  }));

  it(`Новое значение маски должно быть 13 dec 197`, () => expect(res.newValue).toBe("13 dec 197"));
  it(`Новая позиция курсора должна быть 10`, () => expect(res.newSelStart).toBe(10));
});
