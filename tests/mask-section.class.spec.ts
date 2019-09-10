// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from "../src/internationalization/internationalization.service";
import { MaskSection, Action } from "../src/mask/mask-section.class";
import { MaskValue } from "../src/mask/mask-value.class";
import { MaskSettings } from "../src/mask/mask-settings.class";
import { Mask } from "../src/mask/mask.class";
import { Keys } from '../src/keys/keys.class';
import { async } from '@angular/core/testing';

describe(`MaskValue [dd.mm.yyyy] - split second section of "13.12.2018": `, () => {
  let maskValue: any;

  beforeEach(async(() => {
    let intl = new InternationalizationService();
    let settings = new MaskSettings(" ");
    let m: Mask = new Mask(intl);
    let sType = m.selectSectionType("mm");

    let section = new MaskSection(intl, settings, "mm", ".", sType);

    maskValue = section.extract("13.12.2018", 3, 4, 0);
  }));

  it(`beforeValue should be equal "13."`, () => expect(maskValue.before).toBe("13."));
  it(`sectionValue should be equal "12"`, () => expect(maskValue.section.value()).toBe("12"));
  it(`delimiter should be equal "."`, () => expect(maskValue.delimiter).toBe("."));
  it(`afterValue should be equal "2018"`, () => expect(maskValue.after).toBe("2018"));
  it(`nextPos should be equal 6`, () => expect(maskValue.nextSectionPos()).toBe(6));

  it(`Начало секции перед курсором должно быть 1`, () => expect(maskValue.section.beforeChars).toBe("1"));
  it(`Символ на позиции курсора должен быть 2`, () => expect(maskValue.section.currentChar).toBe("2"));
});

describe(`MaskValue [mm/dd/yyyy] - apply key '3' with selStart=3 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new InternationalizationService();

    let mask = new Mask(intl);

    mask.pattern = "mm/dd/yyyy";
    let section = mask.sections[1];
    res = section.applyKey('12/', 0, '3', 3, 3, 0);
  }));

  it(`Новое значение маски должно быть 12/3`, () => expect(res.newValue).toBe("12/3"));
  it(`Новая позиция курсора должна быть 4`, () => expect(res.selStart).toBe(4));
});

describe(`MaskValue [mm/dd/yyyy] - apply key '/' with selStart=1: `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new InternationalizationService();
    let settings = new MaskSettings(" ");
    settings.appendPlaceholders = false;


    let mask = new Mask(intl);
    mask.pattern = "mm/dd/yyyy";
    let section = mask.sections[1];
    res = section.applyKey('1', 0, '/', 0, 1, 0, true);
  }));

  it(`Новое значение маски должно быть 01/`, () => expect(res.newValue).toBe("01/"));
  it(`Новая позиция курсора должна быть 3`, () => expect(res.selStart).toBe(3));
});

describe(`Автоматическое заполнение секции первым вариантом: `, () => {
  let res: any;

  beforeEach(async(() => {
    let settings: MaskSettings = new MaskSettings("_", true);
    settings.appendPlaceholders = true;
    settings.defaultOptions = true;

    let intl = new InternationalizationService();
    let mask = new Mask(intl);
    mask.settings = settings;
    mask.pattern = "dd mmm yyyy";
    let section = mask.sections[1];
    res = section.setDefaultVariant("13 ___ ____", 3);
  }));

  it(`Новое значение маски должно быть 13 jan ____`, () => expect(res).toBe("13 jan ____"));
});

describe(`MaskValue [dd mmm yyyy] - apply key 'd' on value '13 ' with selStart=3 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new InternationalizationService();
    let mask = new Mask(intl);
    mask.pattern = "dd mmm yyyy";
    let section = mask.sections[1];
    res = section.applyKey('13 ', 0, 'd', 3, 3, 0);
  }));

  it(`Новое значение маски должно быть 13 dec`, () => expect(res.newValue).toBe("13 dec"));
  it(`Новая позиция курсора должна быть 4`, () => expect(res.selStart).toBe(4));
});

describe(`MaskValue [dd mmm yyyy] - apply key 'Delete' on 13 dec 1979  with selStart=10 : `, () => {
  let res: any;

  beforeEach(async(() => {
    let intl = new InternationalizationService();
    let mask = new Mask(intl);
    mask.pattern = "dd mmm yyyy";
    let section = mask.sections[2];
    res = section.applyKey('13 dec 1979', Keys.DELETE, '', 7, 10, 0);
  }));

  it(`Новое значение маски должно быть 13 dec 197`, () => expect(res.newValue).toBe("13 dec 197"));
  it(`Новая позиция курсора должна быть 10`, () => expect(res.selStart).toBe(10));
});


describe(`Section features`, () => {
  let intl = new InternationalizationService();
  let mask = new Mask(intl);
  mask.pattern = "dd mmm yyyy";
  let section = mask.sections[0];
  let monthSection = mask.sections[1];

  it(`Autocorrect 99 jan 2019 -> 31 jan 2019`, () => {
    expect(section.autoCorrect('99 jan 2019', 0, 0, 0).newValue).toBe('31 jan 2019');
  });

  it(`Select last char of first section`, () => {
    let res = section.selectLast('31 jan 2019', 0);
    expect(res.selStart).toBe(1);
    expect(res.selLength).toBe(1);
  });

  it(`Set default month`, () => {
    let res = monthSection.setDefaultVariant('31 ', 3);
    expect(res).toBe('31 jan');
  });

  it(`Right arrow key`, () => {
    let res2 = monthSection.applyKey('31 jan 2019', Keys.RIGHT, '', 3, 3, 1);
    expect(res2.selStart).toBe(4);
  });

  it(`Right arrow key at the end of the section`, () => {
    let res3 = monthSection.applyKey('31 jan 2019', Keys.RIGHT, '', 3, 5, 1);
    expect(res3.action).toBe(Action.GO_FWD);
  });

});


describe(`Section features (replaceMode = false, defaultOptions = false)`, () => {
  let intl = new InternationalizationService();
  let mask = new Mask(intl);
  mask.pattern = "dd mmm yyyy";
  mask.settings = new MaskSettings('_');
  mask.settings.replaceMode = false;
  mask.settings.defaultOptions = false;
  mask.settings.incDecByArrows = true;
  const section = mask.sections[0];
  const monthSection = mask.sections[1];

  it(`Select last char of first section `, () => {
    let res = section.selectLast('12 jan 2019', 0);
    expect(res.selStart).toBe(1);
    expect(res.selLength).toBe(0);
  });

  it(`Set default month`, () => {
    let res = monthSection.setDefaultVariant('31 ', 3);
    expect(res).toBe('31 ');
  });

  it(`Prev day by down arrow key`, () => {
    let res3 = section.applyKey('30 jan 2019', Keys.DOWN, '', 0, 0, 1);
    expect(res3.newValue).toBe('29 jan 2019');
  });

  it(`Next day by up arrow key`, () => {
    let res3 = section.applyKey('30 jan 2019', Keys.UP, '', 0, 0, 1);
    expect(res3.newValue).toBe('31 jan 2019');
  });

  it(`Prev month by down arrow key`, () => {
    let res3 = monthSection.applyKey('31 jan 2019', Keys.DOWN, '', 3, 5, 1);
    expect(res3.newValue).toBe('31 dec 2019');
  });

  it(`Next month by up arrow key`, () => {
    let res3 = monthSection.applyKey('31 jan 2019', Keys.UP, '', 3, 5, 1);
    expect(res3.newValue).toBe('31 feb 2019');
  });

});
