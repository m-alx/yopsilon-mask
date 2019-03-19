// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { async } from '@angular/core/testing';

import { InternationalizationService } from "../src/internationalization/internationalization.service";
import { MaskSection, MaskResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { Mask } from "../src/mask/mask.class";

import { DateParserPipe } from "../src/dates/date-parser.pipe";

describe(`Parse datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30 pm)`, () => {

  let intl = new InternationalizationService();

  let dateString = "01/05/19 1:30 pm";

  let parser = new DateParserPipe(intl);
  let pattern = "MM/dd/yy h:mi tt";
  let res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

  it(`Month = 0`, () => expect(res.getMonth()).toBe(0));
  it(`Day = 5`, () => expect(res.getDate()).toBe(5));
  it(`Year = 2019`, () => expect(res.getFullYear()).toBe(2019));
  it(`Hours = 13`, () => expect(res.getHours()).toBe(13));
  it(`Minutes = 30`, () => expect(res.getMinutes()).toBe(30));
});

describe(`Parse datetime by Mask (mask=dd mmm yyyy, value=12 dec 2018)`, () => {

  let intl = new InternationalizationService();

  let dateString = "12 dec 2018";

  let parser = new DateParserPipe(intl);
  let pattern = "dd mmm yyyy";
  let res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

  it(`Month = 11`, () => expect(res.getMonth()).toBe(11));
  it(`Day = 12`, () => expect(res.getDate()).toBe(12));
  it(`Year = 2018`, () => expect(res.getFullYear()).toBe(2018));
});


describe(`Parse not matched date (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30)`, () => {

  let intl = new InternationalizationService();

  let dateString = "01/05/19 1:30";

  let parser = new DateParserPipe(intl);
  let pattern = "MM/dd/yy h:mi tt";
  let res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be Invalid Date`, () => expect(res.getTime()).toBeNaN());
});

describe(`Parse invalid date (mask=MM/dd/yy, value=02/31/19)`, () => {

  let intl = new InternationalizationService();

  let dateString = "02/31/19";

  let parser = new DateParserPipe(intl);
  let pattern = "MM/dd/yy";
  let res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

  it(`Result must be Invalid Date`, () => expect(res.getTime()).toBeNaN());
});
