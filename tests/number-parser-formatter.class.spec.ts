// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberParserFormatter } from "../src/numbers/number-parser-formatter.class";

// this.parseFormat("{.3-5} РУБ");
let testStr1 = "$123,456,789.01"; // $123,45|6,|789.01 -> 12345|6|789.01 ->
let testStr2 = "-1.2345e+6";
let testStr3 = "123 456,78 РУБ";
let testStr4 = "12,345.00";

let testFmt1 = "${1.2}";
let testFmt2 = "";
let testFmt3 = "{1.2} РУБ";
let testFmt4 = "{1.2}";


describe(`Parse ` + testStr1 + " with selStart = 7 and selEnd = 9", () => {

  let v = NumberParserFormatter.parse(testStr1, testFmt1, ['.',','], 7, 9);
  it(`Value = 123,456,789.01"`, () => expect(v.value).toBe(123456789.01));
  it(`SelStart = 5`, () => expect(v.selStart).toBe(5));
  it(`SelEnd = 6`, () => expect(v.selEnd).toBe(6));
});

describe(`Parse ` + testStr4 + " with selStart = 2", () => {

  let v = NumberParserFormatter.parse(testStr4, testFmt4, ['.',','], 2, 2);
  it(`Value = 12345.00"`, () => expect(v.value).toBe(12345.00));
  it(`SelStart = 2`, () => expect(v.selStart).toBe(2));
  it(`SelEnd = 2`, () => expect(v.selEnd).toBe(2));
});

/*
describe(`Parse ` + testStr2, () => {
  let v: number = NumberParserFormatter.parse(testStr2, "", ['.',',']);
  it(`Value = ` + testStr2, () => expect(v).toBe(-1.2345e+6));
});

describe(`Parse ` + testStr3, () => {

  let v: number = NumberParserFormatter.parse(testStr3, testFmt3, [',',' ']);
  it(`Value = ` + testStr3, () => expect(v).toBe(123456.78));
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.1;
  let s: string = NumberParserFormatter.format(v, "{1.3-4}", ['.',',']);
  it(v +` with {1.2-4} = ` + testStr3, () => expect(s).toBe("123,456,789.100"));
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.245;
  let s: string = NumberParserFormatter.format(v, "{+1.2}", ['.',',']);
  it(v +` with {1.2} = "123,456,789.25"`, () => expect(s).toBe("+123,456,789.25"));
});

describe(`Format ` + testStr1, () => {
  let v = -123456789.245;
  let s: string = NumberParserFormatter.format(v, "{1.2}", ['.',',']);
  it(v +` with {1.2} = "-123,456,789.25"`, () => expect(s).toBe("-123,456,789.25"));
});
*/
