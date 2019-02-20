// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberParserFormatter } from "../src/numbers/number-parser-formatter.class";

let testStr1 = "$123,456,789.01";
let testStr2 = "-1.2345e+6";
let testStr3 = "123 456,78 РУБ";
let testStr4 = "12,345.00";

let testFmt1 = "${1.2}";
let testFmt2 = "";
let testFmt3 = "{1.2} РУБ";
let testFmt4 = "{1.2}";


describe(`Parse ` + testStr1, () => {

  let v = NumberParserFormatter.parse(testStr1, testFmt1, ['.',',']);
  it(`Value = 123,456,789.01"`, () => expect(v).toBe(123456789.01));
  //it(`SelStart = 5`, () => expect(v.selStart).toBe(5));
  //it(`SelEnd = 6`, () => expect(v.selEnd).toBe(6));
});

describe(`Parse ` + testStr4, () => {

  let v = NumberParserFormatter.parse(testStr4, testFmt4, ['.',',']);
  it(`Value = 12345.00"`, () => expect(v).toBe(12345.00));
  //it(`SelStart = 2`, () => expect(v.selStart).toBe(2));
  //it(`SelEnd = 2`, () => expect(v.selEnd).toBe(2));
});

describe(`Parse ` + testStr2, () => {
  let v: number = NumberParserFormatter.parse(testStr2, "", ['.',',']);
  it(`Value = ` + testStr2, () => expect(v).toBe(-1.2345e+6));
});

describe(`Parse ` + testStr3, () => {

  let v: number = NumberParserFormatter.parse(testStr3, testFmt3, [',',' ']);
  it(`Value = ` + testStr3, () => expect(v).toBe(123456.78));
});

describe(`Parse empty string`, () => {

  let v: number = NumberParserFormatter.parse("", testFmt3, [',',' ']);
  it(`Value = null`, () => expect(v).toBeNull());
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.1;
  let s: string = NumberParserFormatter.format(v, "{1.3-4}", ['.',',']);
  it(v + ` with {1.3-4} = ` + testStr3, () => expect(s).toBe("123,456,789.100"));
});

describe(`Format ` + testStr1, () => {
  let v = 123456789.245;
  let s: string = NumberParserFormatter.format(v, "{+1.2}", ['.',',']);
  it(v + ` with {1.2} = "123,456,789.25"`, () => expect(s).toBe("+123,456,789.25"));
});

describe(`Format ` + testStr1, () => {
  let v = -123456789.245;
  let s: string = NumberParserFormatter.format(v, "{1.2}", ['.',',']);
  it(v + ` with {1.2} = "-123,456,789.25"`, () => expect(s).toBe("-123,456,789.25"));
});

describe(`Format 0`, () => {
  let v = 0;
  let s: string = NumberParserFormatter.format(v, "{1.3-4}", ['.',',']);
  it(v + ` with {1.3-4} = 0.000`, () => expect(s).toBe("0.000"));
});

describe(`Reformat ` + testStr1, () => {
  let s = "-123456789.25";
  let state: any = NumberParserFormatter.reformat(s, "{1.2}", ['.',','], 0, 0);
  it(s + ` with {1.2} = "-123,456,789.25"`, () => expect(state.value).toBe("-123,456,789.25"));
});
