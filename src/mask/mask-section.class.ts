// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from '../internationalization/internationalization.service';
import { MaskSectionType } from './mask-section-type.class';
import { MaskSettings } from './mask-settings.class';

import { MaskSectionValue } from './mask-section-value.class';
import { MaskValue } from './mask-value.class';
import { Keys } from '../keys/keys.class';

// Actions which are initialized by section
export class Action {

  static NONE = new Action('NONE');
  static APPLY = new Action('APPLY');
  static SKIP = new Action('SKIP');
  static GO_FWD = new Action('GO_FWD');
  static GO_BACK = new Action('GO_BACK');
  static GO_BACK_AND_DELETE = new Action('GO_BACK_AND_DELETE');  

  constructor(public name: string) { }
}

// Result of user input
export class MaskResult {

  public inSection: boolean;
  public selStart: number;
  public selLength: number;

  constructor(
      public newValue: string,
      public action: Action,
      public nextSectionPos: number
  ) { }
}

// Section of pattern
export class MaskSection {

  constructor(
    public intl: InternationalizationService,
    public settings: MaskSettings,
    public section: string, // Value of the mask
    public delimiter: string,
    public sectionType: MaskSectionType = null
    ) { }

  // Minimum length of value
  public get length(): number {
    if (this.hasOptions()) {
      let min: number = 99;
      this.sectionType.options.forEach(v => {
        if (v.length < min)
          min = v.length;
      });
      return min;
    }
    return this.section.length;
  }

  // Maximum length
  public get maxLength(): number {

    if (this.hasOptions()) {
      let ml: number = 0;
      this.sectionType.options.forEach(v => {
        if (v.length > ml)
          ml = v.length;
      });
      return ml;
    }

    if (this.sectionType && this.sectionType.max && ('' + this.sectionType.max).length > this.section.length)
      return ('' + this.sectionType.max).length;
    else
      return this.section.length;
  }

  private isEmptySection(): boolean {
    return this.section === '';
  }

  public hasOptions(): boolean {
    return this.sectionType && this.sectionType.options && this.sectionType.options.length > 0;
  }

  public hasRegExp(): boolean {
    return this.sectionType && this.sectionType.regExp !== null && this.sectionType.regExp !== undefined;
  }

  public isNumeric(): boolean {
    return this.sectionType && this.sectionType.numeric;
  }

  public numericValue(value: string): number {
    return +value;
  }

  public checkMinMax(n: number): number {
    if (n === null)
      return null;

    if (!this.sectionType)
      return n;

    if (this.sectionType.min !== undefined && n < this.sectionType.min)
        n = this.sectionType.min;

    if (this.sectionType.max !== undefined && n > this.sectionType.max)
        n = this.sectionType.max;

    return n;
  }

  // String placeholders cleanup method
  removePlaceholders(txt: string): string {
    return txt.split(this.settings.placeholder).join('');
  }

  // Increasing section's value upon Up button press
  private incValue(value: string): string {

    // Next option
    if (this.hasOptions()) {
      let i = this.sectionType.options.indexOf(value);
      return i < this.sectionType.options.length - 1 ? this.sectionType.options[i + 1] : this.sectionType.options[0];
    }

    // Incrementing numeric value
    if (this.isNumeric() && this.sectionType.max !== undefined) {
      let n = this.numericValue(value);
      if (isNaN(n))
        n = this.sectionType.min === undefined ? 0 : this.sectionType.min;
      else
        n++;

      let res = '' + this.checkMinMax(n);
      while (res.length < this.length)
          res = '0' + res;

      return res;
    }

    // Returning current value if none found
    return value;
  }

  // Предыдущее значение секции при нажатии стрелки вниз
  private decValue(value: string): string {

    // Previous option
    if (this.hasOptions()) {
      let i = this.sectionType.options.indexOf(value);
      return i > 0 ? this.sectionType.options[i - 1] : this.sectionType.options[this.sectionType.options.length - 1];
    }

    // Previous numeric value
    if (this.isNumeric() && this.sectionType.min !== undefined) {
      let n = this.numericValue(value);
      if (isNaN(n))
        n = this.sectionType.min === undefined ? 0 : this.sectionType.max;
      else
        n--;

      let res = '' + this.checkMinMax(n);
      while (res.length < this.length)
          res = '0' + res;

      return res;
    }

    // Returning current value if none found
    return value;
  }

  // Auto-correction of section's value
  public autoCorrectVal(s: string): string {

    if (!this.sectionType)
      return s;

    if (this.hasOptions()) {
      let variant = this.sectionType.options.find(v => v.toLowerCase() === s.toLowerCase());
      if (!variant)
        s = this.sectionType.options.length > 0 ? this.sectionType.options[0] : '';
      return s;
    }

    let res = s;

    if (this.isNumeric()) {

      let n = this.numericValue(res);
      // Numeric value is expected
      if (isNaN(n) || s === '') {
        return s; // Bad or empty value
      }

      // Year
      if (this.sectionType.datePart === 'yyyy') {          
        if (s.length === 2) {          
          n += n < 50 ? 2000 : 1900;
        } else {
          if (s.length !== 4) {
            return s;
          }
        }
      }

      // Numeric value recognized. Identifying min and max values.
      // But only if autoCorrect is enabled.
      // Otherwise numeric value of defined length is returned
      if (this.settings.autoCorrect)
        n = this.checkMinMax(n);

      if (n !== null) {
        res = '' + n;
        while (res.length < this.length) {
            res = '0' + res;
        }
      }
    }

    while (res.length < this.length) {
      res += this.settings.placeholder;
    }

    return res;
  }

  // Section extracts its value from input using following method
  public extract(
    maskValue: string, // Input mask value
    sectionPos: number,   // Section value's first char index
    selStart: number = 0,
    selLength: number = 0
  ): MaskValue
  {
    let res = new MaskValue();
    let len = this.length;
    let i2 = sectionPos + len;

    if (maskValue === null || maskValue === undefined) {
      maskValue = '';
    }

    // Variable length brings trouble...
    if (this.length < this.maxLength) {
      // ...so here a small block should be placed to identify relative position compared to delimiter or end of line,
      // but less than MaxLength
      let i = sectionPos;
      while (i < maskValue.length && i < (sectionPos + this.maxLength)) {
        if (this.delimiter !== '' && maskValue[i] === this.delimiter[0]) {
          break;
        }
        i++;
      }
      i2 = i;
      len = i2 - sectionPos;
    }

    // Delimiter might not be present...
    let delimiterStart = i2;
    let delimiterEnd = delimiterStart;

    if (this.delimiter !== '') {
      while (delimiterEnd < maskValue.length) {
        let c = maskValue[delimiterEnd];
        if (c === this.delimiter[delimiterEnd - delimiterStart]) {
          delimiterEnd++;
        } else {
          break;
        }
      }
    }

    if (i2 > maskValue.length) {
      i2 = maskValue.length;
    }
    if (delimiterEnd > maskValue.length) {
      delimiterEnd = maskValue.length;
    }

    let section = maskValue.substring(sectionPos, i2);

    if (section.length > this.maxLength) {
      throw new Error("Invalid value length: " + section);
    }

    let selStart_local = selStart - sectionPos;

    res.sectionPos = sectionPos;

    res.before = maskValue.substring(0, sectionPos); // До секции
    res.section = new MaskSectionValue(section, sectionPos, selStart); // Значение секции
    res.delimiter = maskValue.substring(delimiterStart, delimiterEnd); // Разделитель
    res.after = maskValue.substring(delimiterEnd);  // После секции

    res.inSection = selStart_local >= 0 && selStart_local <= res.section.length;

    return res;
  }

  private skip(mv: MaskValue, selStart: number): MaskResult {
    let res: MaskResult = new MaskResult(mv.value(), Action.SKIP, mv.nextSectionPos());
    res.selStart = selStart;
    return res;
  }

  private none(mv: MaskValue): MaskResult {
    let res: MaskResult = new MaskResult(mv.value(), Action.NONE, mv.nextSectionPos());
    return res;
  }

  // Section processing result - button pressing is applied
  private apply(mv: MaskValue, newSectionValue: string, selStart: number, direction: number = 1, isLast: boolean = false): MaskResult {

    let selStart_local = selStart - mv.sectionPos;

    // If section is the last and value length is equal to maximum length and carriage is positioned at end of line...
    // ... we're correcting the value
    if (isLast
        && newSectionValue.length === this.maxLength
        && selStart_local >= newSectionValue.length - 1
        && direction > 0
      ) {
      newSectionValue = this.autoCorrectVal(newSectionValue);
      mv.delimiter = this.delimiter;
    }

    // Updating the value
    mv.update(newSectionValue, selStart);

    // Deciding what's next
    if (direction > 0)
      return this.goFwd(mv, selStart, 1, false); // Moving forward
    else
      if (direction < 0)
        return this.goBack(mv, selStart, 1, false, isLast);  // Moving backwards
      else {
        // Stand still
        let res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());
        res.selStart = selStart;
        res.selLength = this.settings.replaceMode && selStart_local < this.length ? 1 : 0;
        return res;
      }
  }

  // Section processing result - button with delimiter symbol pressing is applied
  private applyDelimiter(mv: MaskValue, selStart: number): MaskResult {
    // autoCorrection is necessary
    let sv = this.autoCorrectVal(mv.section.value());

    mv.update(sv, selStart)
    mv.delimiter = this.delimiter;

    // Moving forward
    let res: MaskResult = new MaskResult(mv.value(), Action.GO_FWD, mv.nextSectionPos());
    res.selStart = mv.nextSectionPos();
    return res;
  }

  // Moving carriage backward
  private goBack(mv: MaskValue, selStart: number, selLength: number, byBackspace: boolean = false, isLast: boolean = false): MaskResult {
    let res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());

    if (selStart === 0 && selLength <= 1) {
      // Case when first symbol is selected. Carriage position is set to the beginning of the line
      res.selLength = 0;
      return res;
    }

    // For last section with delimiter it doesn't matter if we are standing before or after delimiter
    if (isLast && selStart > (mv.sectionPos + this.maxLength) && this.settings.replaceMode)
      selStart = mv.sectionPos + this.maxLength;

    res.selStart = selStart - 1;
    res.selLength = this.settings.replaceMode ? 1 : 0;

    let selStart_local = res.selStart - mv.sectionPos;

    // If we exceed minimal length...
    if (selStart_local >= this.length && selStart_local >= mv.section.length)
      res.selLength = 0;

    let newSelStart_local = res.selStart - mv.sectionPos;
    if (newSelStart_local < 0 && mv.before !== '')
      res.action = byBackspace ? Action.GO_BACK_AND_DELETE : Action.GO_BACK;

    if (res.selStart < 0)
      res.selStart = 0;

    if (res.selLength === 0 && selStart === 0)
      res.selLength = 0;

    return res;
  }

  // Moving carriage forward
  private goFwd(mv: MaskValue, selStart: number, selLength: number, appendDelimiter: boolean = false): MaskResult {
    let selStart_local: number = selStart - mv.sectionPos;

    let res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());

    // replaceMode, selLength === 0 and something is present
    if (this.settings.replaceMode && selLength === 0 && mv.section.currentChar !== '') {
      // Carriage stands still and next char is selected
      res.selStart = selStart;
      res.selLength = 1;
    } else {
      // Moving one char forward
      if (mv.after !== '' || mv.section.afterChars !== '') {
        res.selStart = selStart + 1;
        res.selLength = (mv.section.currentChar !== '' && this.settings.replaceMode) ? 1 : 0;

        // Section with variable length. If we reached the end of it, then selLength = 0
        if (res.selStart - mv.sectionPos >= this.length && mv.section.afterChars === '')
          res.selLength = 0;
      } else
        {
          // Nothing's present next, just positoning the carriage in the end of the section
          res.selStart = selStart + 1;
          res.selLength = 0;
        }
    }

    let newSelStart_local = res.selStart - mv.sectionPos;

    // We're out of bounds
    if (newSelStart_local > mv.section.length || (newSelStart_local === this.maxLength && mv.after !== '')) {
      // Trying to apply autoCorrection
      let v = this.autoCorrectVal(mv.section.value());

      mv.delimiter = this.delimiter;
      // After that carriage's position and next section's position could be different
      mv.update(v, newSelStart_local);
      res.newValue = mv.value();
      res.nextSectionPos = mv.nextSectionPos();
      res.selStart = mv.section.length;

      // Moving forward to next section
      res.action = Action.GO_FWD;
    }

    return res;
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char); //  char.match(/\d/) !== '';
  }

  // Checking if Button is applicable to section
  // We should return:
  //    - if button pressing has been applied
  //    - new section value
  //    - new carriage position
  //    - new selection length
  applyKey(value: string,   // Mask value
      keyCode: number,               // Key which has been pressed
      keyChar: string,
      sectionPos: number,        // Section's first symbol index
      selStart: number,          // Current carriage position
      selLength: number,         // Number of currently selected chars
      acceptDelimiterChars: boolean = false, // If symbols of delimiter are acceptable
      isLast: boolean = false                // Is last section
    ): MaskResult
    {
      // Parsing the value
      let mv: MaskValue = this.extract(value, sectionPos, selStart, selLength);

      // Cursor's positioned before the section. Doing nothing
      if (selStart < sectionPos)
          return this.none(mv);

      // Cursor's positioned after the section. Skipping the section
      if (!mv.inSection)
        if (value.length !== selStart || !isLast)
          return this.skip(mv, selStart);

      // Relative carriage position compared to current section's beginning
      let selStart_local = selStart - sectionPos;

      // If carriage is positioned at the end of section and section doesn't have a delimiter
      // And next section contains something
      // Then we're located not in current section, but in the beginning of the next. Sending a SKIP
      if (selStart_local === this.maxLength && this.delimiter === '' && mv.after !== '')
        return this.skip(mv, selStart);

      if (keyChar !== this.delimiter[0] || !acceptDelimiterChars) {

        if (this.isEmptySection() ||  // Empty section
            (selStart === (sectionPos + mv.section.length) && // Our position's the beginning of the section
             mv.section.length === this.maxLength &&          //  Section value is complete
             keyChar.length === 1)
        ) {
          // Adding a delimiter if necessary
          // Setting a corrected value and asking to move to a next section
          mv.delimiter = this.delimiter;
          mv.update(this.autoCorrectVal(mv.section.value()), selStart);
          return this.skip(mv, mv.nextSectionPos()); // To the beginning of next section
        }
      }

      // Single char
      if (keyChar.length === 1)  {

        let cValue = mv.section.beforeChars;
        cValue += keyChar; // Potentially new value

        //  Section values are limited to a list of possible values
        if (this.hasOptions() && cValue !== mv.section.beforeChars) {
          let optionFound: string = null;
          this.sectionType.options.some(variant => {
            if (selStart_local < variant.length && variant.substring(0, cValue.length).toLowerCase() === cValue.toLowerCase()) {
              optionFound = variant;
              return true;
            }
            return false;
          });

          if (optionFound !== null)
            return this.apply(mv, optionFound, selStart, 1, isLast);
        }

        // Regular expression
        if (this.hasRegExp()) {
          // New value will be:
          let nv: string = mv.section.value(keyChar);

          if (this.sectionType.regExp.test(nv)) // And we can accept it
            return this.apply(mv, nv, selStart, 1, isLast);
        }

        // Section is configured with char types
        if (!this.hasOptions() && !this.isEmptySection() && this.sectionType.regExp === undefined) {
          let isOk: boolean = false;

          if (selStart_local < this.maxLength) {
            if (this.sectionType.numeric && this.isDigit(keyChar)) {
              isOk = true;
            }
          }

          if (isOk)
            return this.apply(mv, mv.section.value(keyChar), selStart, 1, isLast);
        }

        // Delimiter char is entered
        if (this.delimiter !== '' && keyChar === this.delimiter[0] && acceptDelimiterChars) {
          // If nothing has been entered then there is no reason to go forward
          if (this.removePlaceholders(mv.section.value()) === '' && !this.isEmptySection())
            return this.apply(mv, mv.section.value(), selStart, 0);

          return this.applyDelimiter(mv, selStart);
        }
      }

      // Delete key
      if (keyCode === Keys.DELETE) {

        // Variable length of the section. We've exceeded minimum value
        if (selStart_local >= this.length && mv.section.afterChars === '') {
          if (mv.after === '')
            mv.delimiter = '';
          return this.apply(mv, mv.section.beforeChars, selStart, 0);
        }

        if (mv.after === '' &&  mv.section.afterChars === '') {
          // No more data after the char being deleted
          mv.delimiter = '';
          return this.apply(mv, mv.section.beforeChars, selStart, 0);
        }
        else
          return this.apply(mv, mv.section.value(this.settings.placeholder), selStart, 0);
      }

      // Backspace key
      if (keyCode === Keys.BACKSPACE) {

        if (mv.section.length === 0) {
          return this.goBack(mv, selStart, selLength, true, isLast);
        }

        if (mv.section.beforeChars === '') {
          // Nothing to delete in current section
          if (mv.before === '') {
            // is first
            return this.none(mv);
          }

          // Deleting in the previous section
          return this.goBack(mv, selStart, selLength, true, isLast);
        }

        mv.section.beforeChars = mv.section.beforeChars.substring(0, mv.section.beforeChars.length - 1);

        if ((mv.section.beforeChars.length >= this.length && mv.after === '') ||
            (mv.section.currentChar === '' && mv.after === '')) {
          // Deleting completely
          // Delimiter should be deleted too
          mv.delimiter = '';
        } else {
          // Replacing with a placeholder
          if (mv.section.beforeChars.length < this.length) {
            mv.section.beforeChars += this.settings.placeholder;
          }
        }

        return this.apply(mv, mv.section.value(), selStart, -1, isLast);
      }

      // Moving backward
      if (keyCode === Keys.LEFT) {
        return this.goBack(mv, selStart, selLength, false, isLast);
      }

      // Moving forward
      if (keyCode === Keys.RIGHT) {
        return this.goFwd(mv, selStart, selLength);
      }

      // Incrementing value of the section upon 'Up' key pressing
      if (keyCode === Keys.UP && this.settings.incDecByArrows) {
        return this.apply(mv, this.incValue(mv.section.value()), selStart, 0);
      }

      // Decrementing value of the section upon 'Down' key pressing
      if (keyCode === Keys.DOWN && this.settings.incDecByArrows) {
        return this.apply(mv, this.decValue(mv.section.value()), selStart, 0);
      }

    return this.none(mv);
  }

  // If section is empty then fill with first option of list
  setDefaultVariant(value: string, sectionPos: number): string {

    if (!this.settings.defaultOptions) {
      return value;
    }

    if (!this.hasOptions()) {
      return value;
    }

    // Get section value
    const mv: MaskValue = this.extract(value, sectionPos, 0, 0);

    // Remove placeholderes
    let s = this.removePlaceholders(mv.section.value());

    // If empty...
    if (s === '')
    {
      let applyResult: MaskResult = this.apply(mv, this.sectionType.options[0], 0, 0);
      value = applyResult.newValue;
    }

    return value;
  }

  // Selcting first symbol of the section
  selectFirst(value: string, sectionPos: number): MaskResult {

    let mv: MaskValue = this.extract(value, sectionPos, sectionPos, 0);
    let res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());

    res.selStart = sectionPos;
    res.selLength = this.settings.replaceMode ? 1 : 0;
    if (this.isEmptySection())
      res.selLength = 0;

    return res;
  }

  // Selecting last symbol of the section
  public selectLast(value: string, sectionPos: number, forDelete: boolean = false): MaskResult {

    let mv: MaskValue = this.extract(value, sectionPos, sectionPos, 0);
    let res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());

    if (!this.settings.replaceMode) {
      // We need to be positioned before the last symbol
      res.selStart = sectionPos + mv.section.length - 1;
      res.selLength = 0;
      return res;
    }

    if ((!forDelete && mv.section.length >= this.length && mv.section.length < this.maxLength) || this.isEmptySection()) {
      // We haven't reached maximum length of the section
      res.selStart = sectionPos + mv.section.length;
      res.selLength = 0;
    } else {
      // We've reached maxLength - selecting last symbol
      res.selStart = sectionPos + mv.section.length - 1;
      res.selLength = 1;
    }

    return res;
  }

  // Autocorrection of the value. Returning everything required in order to apply changes to a control
  public autoCorrect(value: string, sectionPos: number, selStart: number, selLength: number): MaskResult {

    // Parsing
    const mv: MaskValue = this.extract(value, sectionPos, selStart, 0);
    let v = mv.section.value();

    // Correcting the value
    v = this.autoCorrectVal(v);

    // Updating the result
    mv.update(v, selStart);
    const res: MaskResult = new MaskResult(mv.value(), Action.APPLY, mv.nextSectionPos());
    res.selStart = res.newValue.length;
    res.selLength = 0;

    return res;
  }
}
