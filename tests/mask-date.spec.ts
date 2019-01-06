// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { async } from '@angular/core/testing';

import { Internationalization } from "../src/internationalization/internationalization.class";
import { MaskSection, MaskSectionKeyResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { MaskOptions } from "../src/mask/mask-options.class";
import { Mask } from "../src/mask/mask.class";

import { MaskDate } from "../src/mask/mask-date.class";

describe(`Parse datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30 pm)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let dateString = "01/05/19 1:30 pm";
  let res = MaskDate.parseDate(mask.sections, dateString);

  it(`Month = 0`, () => expect(res.getMonth()).toBe(0));
  it(`Day = 5`, () => expect(res.getDate()).toBe(5));
  it(`Year = 2019`, () => expect(res.getFullYear()).toBe(2019));
  it(`Hours = 13`, () => expect(res.getHours()).toBe(13));
  it(`Minutes = 30`, () => expect(res.getMinutes()).toBe(30));
});

describe(`Parse not matched date (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let dateString = "01/05/19 1:30";
  let res = MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be null`, () => expect(res).toBe(null));
});

describe(`Parse invalid date (mask=MM/dd/yy, value=02/31/19)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy";

  let dateString = "02/31/19";
  let res = MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be null`, () => expect(res).toBe(null));
});


describe(`Format datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30 pm)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let date = new Date(2019, 0, 5, 13, 30, 0);
  let res = MaskDate.formatDate(mask.sections, date);

  it(`Formatted value = 01/05/2019 1:30 pm`, () => expect(res).toBe("01/05/19 1:30 pm"));
});

describe(`Format datetime by Mask (mask = dd.MM.yyyy HH:mi:ss.fff, value = 01/05/2019 13:30:15.152)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "dd.MM.yyyy HH:mi:ss.fff";

  let date = new Date(2019, 0, 5, 13, 30, 15, 152);
  let res = MaskDate.formatDate(mask.sections, date);

  it(`Formatted value = 05.01.2019 13:30:15.152`, () => expect(res).toBe("05.01.2019 13:30:15.152"));
});
