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
