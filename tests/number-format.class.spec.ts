// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberFormat } from "../src/numbers/number-format.class";

// this.parseFormat("{.3-5} РУБ");
describe(`Parse format "L = {E1.2-3} km"`, () => {

  let fmt: NumberFormat = NumberFormat.parseFormat("L = {E1.2-3} km");

  it(`Prefix "L = "`, () => expect(fmt.prefix).toBe("L = "));
  it(`Exponential specifier`, () => expect(fmt.specifier).toBe("E"));
  it(`Mimimum integer digits`, () => expect(fmt.intMin).toBe(1));
  it(`Mimimum fraction digits`, () => expect(fmt.fractionMin).toBe(2));
  it(`Maximum fraction digits`, () => expect(fmt.fractionMax).toBe(3));
  it(`Postfix " km"`, () => expect(fmt.postfix).toBe(" km"));

});

describe(`Parse format "$ {+1-3.2}"`, () => {

  let fmt: NumberFormat = NumberFormat.parseFormat("$ {+1-3.2}");

  it(`Prefix "$ "`, () => expect(fmt.prefix).toBe("$ "));
  it(`Signum = true`, () => expect(fmt.signum).toBeTruthy());
  it(`Decimal specifier`, () => expect(fmt.specifier).toBe("D"));
  it(`Minimum integer digits`, () => expect(fmt.intMin).toBe(1));
  it(`Maximum integer digits`, () => expect(fmt.intMax).toBe(3));
  it(`Minimum fraction digits`, () => expect(fmt.fractionMin).toBe(2));
  it(`Maximum fraction digits`, () => expect(fmt.fractionMax).toBe(2));
  it(`No postfix`, () => expect(fmt.postfix).toBe(""));

});
