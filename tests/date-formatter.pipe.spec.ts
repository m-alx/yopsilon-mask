// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { async } from '@angular/core/testing';

import { Internationalization } from "../src/internationalization/internationalization.class";
import { MaskSection, MaskSectionKeyResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { MaskOptions } from "../src/mask/mask-options.class";
import { Mask } from "../src/mask/mask.class";

import { DateFormatterPipe } from "../src/mask/pipes/date-formatter.pipe";


describe(`Format datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 2:30 pm)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let date = new Date(2019, 0, 5, 14, 30, 0);

  let formatter = new DateFormatterPipe();
  let res = formatter.transform(mask, date); // MaskDate.formatDate(mask.sections, date);

  it(`Formatted value = 01/05/2019 2:30 pm`, () => expect(res).toBe("01/05/19 2:30 pm"));
});

describe(`Format datetime by Mask (mask = dd.MM.yyyy HH:mi:ss.fff, value = 01/05/2019 13:30:15.152)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "dd.MM.yyyy HH:mi:ss.fff";

  let date = new Date(2019, 0, 5, 13, 30, 15, 152);
  let formatter = new DateFormatterPipe();
  let res = formatter.transform(mask, date); // MaskDate.formatDate(mask.sections, date);

  it(`Formatted value = 05.01.2019 13:30:15.152`, () => expect(res).toBe("05.01.2019 13:30:15.152"));
});
