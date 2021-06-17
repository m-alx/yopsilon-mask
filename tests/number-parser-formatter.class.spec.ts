// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberParserFormatter } from '../src/numbers/number-parser-formatter.class';
import { Keys } from '../src/keys/keys.class';

let intStr = '2019';
let intFmt = '{0-4}';

let testStr1 = '$123,456,789.01';
let testStr2 = '-1.2345e+6';
let testStr3 = '123 456,78 РУБ';
let testStr4 = '12,345.00';

let testFmt1 = '${1.2}';
let testFmt3 = '{1.2} РУБ';
let testFmt4 = '{1.2}';


describe(`Parse integer value ` + intStr, () => {
  let v = NumberParserFormatter.parse(intStr, intFmt, ['.',',']);
  it(`Value = 2019'`, () => expect(v).toBe(2019));
});

describe(`Format positive value with separators ` + intStr, () => {
   let v = NumberParserFormatter.format(1234, "{R4.2}", ['.',',']);
   it(`Value = '1,234.00'`, () => expect(v).toBe('1,234.00'));
 });

 describe(`Format positive value without separators ` + intStr, () => {
   let v = NumberParserFormatter.format(1234, "{P4.2}", ['.',',']);
   it(`Value = '1234.00'`, () => expect(v).toBe('1234.00'));
 });

describe(`Format integer value ` + intStr, () => {
  let v = NumberParserFormatter.format(2019, intFmt, ['.',',']);
  it(`Value = 2019'`, () => expect(v).toBe('2019'));
});

describe(`Parse '1.66'`, () => {
   let v = NumberParserFormatter.parse('1.66', testFmt4, ['.',',']);
   it(`Value = 1.66`, () => expect(v).toBe(1.66));
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

describe(`Parse -$123.00`, () => {
  let v: number = NumberParserFormatter.parse('-$123.00', '~${N1.2}', ['.',',']);
  it(`Value = -123`, () => expect(v).toBe(-123));
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
  let s = '-1234.25';
  let state: any = NumberParserFormatter.reformat(s, '~${n1.2}', ['.',','], 0, 0);
  it(s + " with ~${n1.2} = '-$1,234.25'", () => expect(state.value).toBe('-$1,234.25'));
});

describe(`Reformat -1 (convertToFormat=true)` , () => {
  let s = '-1';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 0, 0, true);
  it(s + ` with {n1.2} = '-1.00'`, () => expect(state.value).toBe('-1.00'));
});

describe(`Reformat 1`, () => {
  let s = '1';
  let state: any = NumberParserFormatter.reformat(s, '{n4.2}', ['.',','], 0, 0, true);
  it(s + ` with {n4.2} = '0001.00'`, () => expect(state.value).toBe('0001.00'));
});

describe(`Reformat .01`, () => {
  let s = '.01';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 0, 0, false);
  it(s + ` with {n1.2} = '0.01'`, () => expect(state.value).toBe('0.01'));
});

describe(`Reformat 001.01 = 1.01`, () => {
  let s = '001.01';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 3, 6, false);
  it(`value = '1.01'`, () => expect(state.value).toBe('1.01'));
  it(`selStart = 1`, () => expect(state.selStart).toBe(1));
  it(`selEnd = 3`, () => expect(state.selEnd).toBe(4));
});

describe(`Reformat ''`, () => {
  let s = '';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 0, 0, false);
  it(`value = ''`, () => expect(state.value).toBe(''));
});

/*
describe(`Reformat 123000`, () => {
  let s = '123000';
  let state: any = NumberParserFormatter.reformat(s, '{e1.2}', ['.',','], 0, 0, true);
  it(s + ` with {e1.2} = '1.23e5'`, () => expect(state.value).toBe('0001.00'));
});*/

describe(`Reformat after backspace: ` + testStr1, () => {
  let s = '1,312,312,311,231,23.00';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2}', ['.',','], 20, 0);
  it(s + ` = '131,231,231,123,123.00'`, () => expect(state.value).toBe('131,231,231,123,123.00'));
  it('Cursor position = ', () => expect(state.selStart).toBe(19));
});

describe(`Reformat after backspace 2: -$`, () => {
  let s = '-';
  let state: any = NumberParserFormatter.reformat(s, '~${n1.2}', ['.',','], 1, 0);
  it(s, () => expect(state.value).toBe('-'));
  it('Cursor position = ', () => expect(state.selStart).toBe(1));
});

describe(`Reformat after decimal point insert `, () => {
  let s = '123,12.3,123';
  let state: any = NumberParserFormatter.reformat(s, '{n1.2-4}', ['.',','], 0, 0);
  it(s + ` with {n1.2-4} = '12,312.3123'`, () => expect(state.value).toBe('12,312.3123'));
});

describe(`Can accept key`, () => {
  let s = '123';
  let state: any;
  if (NumberParserFormatter.canAcceptKey(s, null, '.', '{1-4.2}', ['.',','], 2))
    state = NumberParserFormatter.reformat(s + '.', '{1-4}', ['.',','], 0, 0);
  it(s + ` Append decimal point at the end of '123'. Result should be '123.'.`, () => expect(state.value).toBe('123.'));

  s = '123.0';
  const res0 = NumberParserFormatter.canAcceptKey(s, null, '-', '{P1-4.2}', ['.',','], s.length);
  it(s + ` Forbid signum for P (positive numbers) specifier ''`, () => expect(res0).toBeFalsy());

  s = '123.0';
  const res = NumberParserFormatter.canAcceptKey(s, null, '.', '{1-4.2}', ['.',','], s.length);
  it(s + ` Can't append decimal point at the end of '123.0'`, () => expect(res).toBeFalsy());

  s = '123.00';
  const res2 = NumberParserFormatter.canAcceptKey(s, null, '0', '{1-4.2}', ['.',','], s.length);
  it(s + ` Can't append 0 at the end of '123.00'`, () => expect(res2).toBeFalsy());

  s = '1230';
  const res3 = NumberParserFormatter.canAcceptKey(s, null, '0', '{1-4.2}', ['.',','], 4);
  it(s + ` Can't append number at the end of '1230' with format {1-4.2}`, () => expect(res3).toBeFalsy());

  s = '-1';
  const res4 = NumberParserFormatter.canAcceptKey(s, null, '0', '{1-4.2}', ['.',','], 0);
  it(s + ` Can't insert number before minus`, () => expect(res4).toBeFalsy());

  s = '$1';
  const res5 = NumberParserFormatter.canAcceptKey(s, null, '0', '${1-4.2}', ['.',','], 0);
  it(s + ` Can't insert number before prefix`, () => expect(res5).toBeFalsy());

  s = '1 kg';
  const res6 = NumberParserFormatter.canAcceptKey(s, null, '0', '{1-4.2} kg', ['.',','], 4);
  it(s + ` Can't append number after postfix`, () => expect(res6).toBeFalsy());

  s = '1.0';
  const res7 = NumberParserFormatter.canAcceptKey(s, null, '.', '{1-4.2} kg', ['.',','], 1);
  it(s + ` Can replace decimal separator`, () => expect(res7).toBeTruthy());

  s = '1e1';
  const res8 = NumberParserFormatter.canAcceptKey(s, null, 'e', '{e1-4.2} kg', ['.',','], 1);
  it(s + ` Can replace e`, () => expect(res8).toBeTruthy());

  s = '1e1';
  const res9 = NumberParserFormatter.canAcceptKey(s, null, '+', '{e1-4.2} kg', ['.',','], 2);
  it(s + ` Can accept '+' after e`, () => expect(res9).toBeTruthy());

  s = '$1';
  const res10 = NumberParserFormatter.canAcceptKey(s, null, '+', '${n1-4.2}', ['.',','], 1);
  it(s + ` Can accept signum before number`, () => expect(res10).toBeTruthy());

  s = '$1';
  const res11 = NumberParserFormatter.canAcceptKey(s, Keys.BACKSPACE, '', '${n1-4.2}', ['.',','], 2);
  it(s + ` Can accept backspace`, () => expect(res11).toBeTruthy());

  s = '-$1';
  const res11_2 = NumberParserFormatter.canAcceptKey(s, Keys.BACKSPACE, '', '~${n1-4.2}', ['.',','], 2);
  it(s + ` Can accept backspace 2`, () => expect(res11_2).toBeTruthy());

  s = '$1.2';
  const res12 = NumberParserFormatter.canAcceptKey(s, Keys.BACKSPACE, '', '${n1-4.2}', ['.',','], 3, 3, true);
  it(s + ` Can't delete decimal point if convertToFormat = true`, () => expect(res12).toBeFalsy());

  s = '$1';
  const res13 = NumberParserFormatter.canAcceptKey(s, null, '-', '~${n1-4.2}', ['.',','], 0);
  it(s + ` Can accept signum before prefix`, () => expect(res13).toBeTruthy());

  s = '$1';
  const res14 = NumberParserFormatter.canAcceptKey(s, null, '-', '~${n1-4.2}', ['.',','], 1);
  it(s + ` Can accept signum after prefix`, () => expect(res14).toBeFalsy());

  s = '-$1';
  const res15 = NumberParserFormatter.canAcceptKey(s, null, '1', '~${n1-4.2}', ['.',','], 1);
  it(s + ` Can't accept digit after signum before prefix`, () => expect(res15).toBeFalsy());

  s = '-';
  const res16 = NumberParserFormatter.canAcceptKey(s, null, '1', '~${n1-4.2}', ['.',','], 1);
  it(s + ` Can accept digit after signum without prefix`, () => expect(res16).toBeTruthy());

});
