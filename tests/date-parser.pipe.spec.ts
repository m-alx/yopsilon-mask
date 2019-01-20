// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { async } from '@angular/core/testing';

import { Internationalization } from "../src/internationalization/internationalization.class";
import { MaskSection, MaskSectionKeyResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { Mask } from "../src/mask/mask.class";

import { DateParserPipe } from "../src/mask/pipes/date-parser.pipe";

describe(`Parse datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30 pm)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let dateString = "01/05/19 1:30 pm";
  let parser = new DateParserPipe();
  let res = parser.transform(mask, dateString); // MaskDate.parseDate(mask.sections, dateString);

  it(`Month = 0`, () => expect(res.getMonth()).toBe(0));
  it(`Day = 5`, () => expect(res.getDate()).toBe(5));
  it(`Year = 2019`, () => expect(res.getFullYear()).toBe(2019));
  it(`Hours = 13`, () => expect(res.getHours()).toBe(13));
  it(`Minutes = 30`, () => expect(res.getMinutes()).toBe(30));
});

describe(`Parse datetime by Mask (mask=dd mmm yyyy, value=12 dec 2018)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "dd mmm yyyy";

  let dateString = "12 dec 2018";
  let parser = new DateParserPipe();
  let res = parser.transform(mask, dateString); // MaskDate.parseDate(mask.sections, dateString);

  it(`Month = 11`, () => expect(res.getMonth()).toBe(11));
  it(`Day = 12`, () => expect(res.getDate()).toBe(12));
  it(`Year = 2018`, () => expect(res.getFullYear()).toBe(2018));
});

describe(`Parse not matched date (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy h:mi tt";

  let dateString = "01/05/19 1:30";
  let parser = new DateParserPipe();
  let res = parser.transform(mask, dateString); // MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be Invalid Date`, () => expect(res.getTime()).toBeNaN());
});

describe(`Parse invalid date (mask=MM/dd/yy, value=02/31/19)`, () => {

  let intl = new Internationalization();
  let mask = new Mask(intl);
  mask.mask = "MM/dd/yy";

  let dateString = "02/31/19";
  let parser = new DateParserPipe();
  let res = parser.transform(mask, dateString); // MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be Invalid Date`, () => expect(res.getTime()).toBeNaN());
});
