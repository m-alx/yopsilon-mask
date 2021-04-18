// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Keys } from '../src/keys/keys.class';
import { waitForAsync } from '@angular/core/testing';

describe(`Which key has been pressed: `, () => {
  it(`Backspace`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'ab', 3, 2, 0).code).toBe(Keys.BACKSPACE));
  it(`Backspace 2`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'ab', 3, 2, 0).code).toBe(Keys.BACKSPACE));
  it(`Backspace 3`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'ac', 2, 1, 1).char).toBe(''));
  it(`Delete`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'ac', 1, 1, 0).code).toBe(Keys.DELETE));
  it(`Arrow left`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'abc', 3, 2, 0).code).toBe(Keys.LEFT));
  it(`Arrow right`, () => expect(Keys.whichKeyHasBeenPressed('abc', 'abc', 2, 3, 0).code).toBe(Keys.RIGHT));
  it(`Typing`, () => expect(Keys.whichKeyHasBeenPressed('abz', 'abcz', 2, 2, 0).char).toBe('c'));
  it(`Typing`, () => expect(Keys.whichKeyHasBeenPressed('abz', 'aby', 2, 2, 1).char).toBe('y'));
});

describe(`Is functional: `, () => {
  it('F1', () => expect(Keys.isFunctional(112)).toBeTruthy());
});
