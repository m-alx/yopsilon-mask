// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask


import { InternationalizationService } from "../src/internationalization/internationalization.service";
import { Mask } from "../src/mask/mask.class";

import { DateParserFormatter } from "../src/dates/date-parser-formatter.class";

/*
getMask(pattern: string) {
  const intl = new InternationalizationService();
  const mask = new Mask(intl);
  mask.pattern = pattern;
  return mask;
}*/

describe(`Format datetime`, () => {

  const intl = new InternationalizationService();
  const date = new Date(2019, 0, 5, 14, 30, 40);
  const date2 = new Date(2019, 0, 5, 0, 30, 40);
  const date1940 = new Date(1940, 0, 5, 14, 30, 40);

  const pattern = 'MM/dd/yy h:mi:ss.fff tt';
  const mask = new Mask(intl);
  mask.pattern = pattern;
  const res = DateParserFormatter.format(date, mask);

  it(`Format 01/05/2019 2:30:40.000 pm`, () => {
    expect(DateParserFormatter.format(date, mask)).toBe('01/05/19 2:30:40.000 pm');
  });

  it(`Format 01/05/1940 2:30:40.000 pm`, () => {
    expect(DateParserFormatter.format(date1940, mask)).toBe('01/05/40 2:30:40.000 pm');
  });

  it(`Format 01/05/2019 12:30:40.000 am`, () => {
    expect(DateParserFormatter.format(date2, mask)).toBe('01/05/19 12:30:40.000 am');
  });

  it(`Format null`, () => expect(DateParserFormatter.format(null, mask)).toBe(''));
  it(`Format null`, () => expect(DateParserFormatter.format(undefined, mask)).toBe(''));
});

describe('Parse datetime', () => {

  const intl = new InternationalizationService();

  const sDate = '01/05/2019 2:30:40.000 pm';
  const sDate1940 = '01/05/1980 12:30:40.000 pm';

  const pattern = 'MM/dd/yyyy h:mi:ss.fff tt';
  const mask = new Mask(intl);
  mask.pattern = pattern;

  const pattern2 = 'MM/dd/yy HH:mi:ss.fff';
  const mask2 = new Mask(intl);
  mask2.pattern = pattern2;

  const pattern3 = 'dd.mm.yyyy NN';
  const mask3 = new Mask(intl);
  mask3.pattern = pattern3;

  it(`Parse 01/05/2019 2:30:40.000 pm`, () => {
    const d = DateParserFormatter.parse(sDate, mask);
    expect(d.getFullYear()).toBe(2019);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
  });

  const sDate0000 = '01/05/0000 2:30:40.000 pm';
  it(`Parse 01/05/0000 2:30:40.000 pm`, () => {
    const d = DateParserFormatter.parse(sDate0000, mask);
    expect(d.getFullYear()).toBe(0);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
  });

  it(`Parse 01/05/1940 12:30:40.000 pm`, () => {
    const d = DateParserFormatter.parse(sDate1940, mask);
    expect(d.getFullYear()).toBe(1980);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
    expect(d.getHours()).toBe(12);
  });

  it(`Parse 01/05/2019 13:30:40.000`, () => {
    const d1 = DateParserFormatter.parse('01/05/19 13:30:40.000', mask2);
    expect(d1.getFullYear()).toBe(2019);
    expect(d1.getMonth()).toBe(0);
    expect(d1.getDate()).toBe(5);
    expect(d1.getHours()).toBe(13);
  });

  it(`Parse 01/05/1980 13:30:40.000`, () => {
    const d1 = DateParserFormatter.parse('01/05/80 13:30:40.000', mask2);
    expect(d1.getFullYear()).toBe(1980);
  });


  it(`Parse invalid date 00/00/2019 13:30:40.000`, () => {
    const d2 = DateParserFormatter.parse('00/00/19 13:30:40.000', mask2);
    expect(d2.getTime()).toBeNaN();
  });

  it(`Parse invalid date 01/xx/2019 13:30:40.000`, () => {
    const d3 = DateParserFormatter.parse('01/xx/19 13:30:40.000', mask2);
    expect(d3.getTime()).toBeNaN();
  });

  it(`Parse incomplete date 01/01/2019 13:30:40.___`, () => {
    const d4 = DateParserFormatter.parse('01/01/19 13:30:40.___', mask2);
    expect(d4.getTime()).toBeNaN();
  });

  it(`Parse empty string`, () => {
    const d5 = DateParserFormatter.parse('', mask2);
    expect(d5).toBeNull();
  });

  it(`Parse with complex pattern`, () => {
    const d6 = DateParserFormatter.parse('01.01.2019 99', mask3);
    expect(d6.getFullYear()).toBe(2019);
  });
});
