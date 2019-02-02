// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { async } from '@angular/core/testing';

import { InternationalizationService } from "../src/internationalization/internationalization.service";
import { MaskSection, MaskResult } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { Mask } from "../src/mask/mask.class";

import { DateFormatterPipe } from "../src/dates/date-formatter.pipe";


describe(`Format datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 2:30 pm)`, () => {

  let intl = new InternationalizationService();

  let date = new Date(2019, 0, 5, 14, 30, 0);

  let formatter = new DateFormatterPipe(intl);
  let pattern = "MM/dd/yy h:mi tt";
  let res = formatter.transform(date, pattern);

  it(`Formatted value = 01/05/2019 2:30 pm`, () => expect(res).toBe("01/05/19 2:30 pm"));
});

describe(`Format datetime by Mask (mask = dd.MM.yyyy HH:mi:ss.fff, value = 01/05/2019 13:30:15.152)`, () => {

  let intl = new InternationalizationService();

  let date = new Date(2019, 0, 5, 13, 30, 15, 152);

  let formatter = new DateFormatterPipe(intl);
  let pattern = "dd.MM.yyyy HH:mi:ss.fff";
  let res = formatter.transform(date, pattern);

  it(`Formatted value = 05.01.2019 13:30:15.152`, () => expect(res).toBe("05.01.2019 13:30:15.152"));
});
