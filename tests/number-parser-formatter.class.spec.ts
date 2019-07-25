// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberParserFormatter } from '../src/numbers/number-parser-formatter.class';

let intStr = '2019';
let intFmt = '{0-4}';

let testStr1 = '$123,456,789.01';
let testStr2 = '-1.2345e+6';
let testStr3 = '123 456,78 РУБ';
let testStr4 = '12,345.00';

let testFmt1 = '${1.2}';
let testFmt2 = '';
let testFmt3 = '{1.2} РУБ';
let testFmt4 = '{1.2}';


describe(`Parse integer value ` + intStr, () => {
  let v = NumberParserFormatter.parse(intStr, intFmt, ['.',',']);
  it(`Value = 2019'`, () => expect(v).toBe(2019));
});

describe(`Format integer value ` + intStr, () => {
  let v = NumberParserFormatter.format(2019, intFmt, ['.',',']);
  it(`Value = 2019'`, () => expect(v).toBe('2019'));
});


describe(`Parse ` + testStr1, () => {

  let v = NumberParserFormatter.parse(testStr1, testFmt1, ['.',',']);
  it(`Value = 123,456,789.01'`, () => expect(v).toBe(123456789.01));
});

describe(`Parse ` + testStr4, () => {

  let v = NumberParserFormatter.parse(testStr4, testFmt4, ['.',',']);
  it(`Value = 12345.00'`, () => expect(v).toBe(12345.00));
});

describe(`Parse ` + testStr2, () => {
  let v: number = NumberParserFormatter.parse(testStr2, '', ['.',',']);
  it(`Value = ` + testStr2, () => expect(v).toBe(-1.2345e+6));
});

describe(`Parse ` + testStr3, () => {

  let v: number = NumberParserFormatter.parse(testStr3, testFmt3, [',',' ']);
  it(`Value = ` + testStr3, () => expect(v).toBe(123456.78));
});

describe(`Parse empty string`, () => {

  let v: number = NumberParserFormatter.parse('', testFmt3, [',',' ']);
  it(`Value = null`, () => expect(v).toBeNull());
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.1;
  let s: string = NumberParserFormatter.format(v, '{N1.3-4}', ['.',',']);
  it(v + ` with {1.3-4} = ` + testStr3, () => expect(s).toBe('123,456,789.100'));
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.245;
  let s: string = NumberParserFormatter.format(v, '{+N1.2}', ['.',',']);
  it(v + ` with {1.2} = '123,456,789.25'`, () => expect(s).toBe('+123,456,789.25'));
});

describe(`Format ` + testStr1, () => {
  let v = -123456789.245;
  let s: string = NumberParserFormatter.format(v, '{N1.2}', ['.',',']);
  it(v + ` with {1.2} = '-123,456,789.25'`, () => expect(s).toBe('-123,456,789.25'));
});

describe(`Format 0`, () => {
  let v = 0;
  let s: string = NumberParserFormatter.format(v, '{1.3-4}', ['.',',']);
  it(v + ` with {1.3-4} = 0.000`, () => expect(s).toBe('0.000'));
});

describe(`Format int value`, () => {
  let v = 123;
  let s: string = NumberParserFormatter.format(v, '{1.0-4}', ['.',',']);
  it(v + ` with {1.0-4} = 0`, () => expect(s).toBe('123'));
});

describe(`Reformat int value`, () => {
  let s = '1';
  let state: any;
  if (NumberParserFormatter.canAcceptKey('', null, '1', '{1-4}', ['.',','], 0, 0))
    state = NumberParserFormatter.reformat(s, '{1-4}', ['.',','], 0, 0);
  it(s + ` with {n1-4} = '1'`, () => expect(state.value).toBe('1'));
});

describe(`Reformat ` + testStr1, () => {
  let s = '-123456789.25';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 0, 0);
  it(s + ` with {n1.2} = '-123,456,789.25'`, () => expect(state.value).toBe('-123,456,789.25'));
});

describe(`Reformat ` + testStr1, () => {
  let s = '-123456789.25';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 0, 0);
  it(s + ` with {n1.2} = '1,123,123,123,123.25'`, () => expect(state.value).toBe('-123,456,789.25'));
});

describe(`Reformat after backspace: ` + testStr1, () => {
  let s = '1,312,312,311,231,23.00';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 20, 0);
  it(s + ` = '131,231,231,123,123.00'`, () => expect(state.value).toBe('131,231,231,123,123.00'));
  it('Cursor position = ', () => expect(state.selStart).toBe(19));
});

describe(`Reformat after decimal point insert `, () => {
  let s = '123,12.3,123';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2-4}', ['.',','], 0, 0);
  it(s + ` with {n1.2-4} = '12,312.3123'`, () => expect(state.value).toBe('12,312.3123'));
});

describe(`Decimal point`, () => {
  let s = '123';
  let state: any;
  //let state: any = NumberParserFormatter.canAcceptKey(s, null, '.', '{1-4.2}', ['.',','], 2);
  if (NumberParserFormatter.canAcceptKey(s, null, '.', '{1-4.2}', ['.',','], 2))
    state = NumberParserFormatter.reformat(s + '.', '{1-4}', ['.',','], 0, 0);
  it(s + `Append decimal point at the end of 123. Result should be 123.`, () => expect(state.value).toBe('123.'));

//  it(s + ` with {n1.2-4} = '12,312.3123'`, () => expect(state.value).toBe('12,312.3123'));
});
