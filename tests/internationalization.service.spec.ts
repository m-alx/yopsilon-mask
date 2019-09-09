// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from "../src/internationalization/internationalization.service";
import { Locale } from "../src/internationalization/locale.class";

import { async } from '@angular/core/testing';

describe(`InternationalizationService: `, () => {

  let intl: InternationalizationService;
  let locale: Locale;

  beforeEach(function() {
    intl = new InternationalizationService();
    locale = {
        name: "Russian",
        shortName: "ru-RU",
        shortMonthNames: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл",
                          "Авг", "Сен", "Окт", "Ноя", "Дек"],

        longMonthNames:  ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                          "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь",
                          "Декабрь"],

        shortDayNames:   ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],

        longDayNames:    ["Воскресенье", "Понедельник", "Вторник", "Среда",
                          "Четверг", "Пятница", "Суббота"],

        firstDayOfWeek: 1,

        dateFormat: "dd.mm.yyyy",
        timeHMFormat: "HH:mi",
        timeHMSFormat: "HH:mi:ss",
        dateTimeHMFormat: "dd.mm.yyyy HH:mi",
        dateTimeHMSFormat: "dd.mm.yyyy HH:mi:ss",

        separators: [",", " "],
        currency: "{N1-12.2} ₽",

        translates: {}
      };
  });

  afterEach(function() {
    intl.locales.splice(1, 1);
    intl.setCurrentLocale(intl.locales[0]);
  });

  it(`Current locale 1`, () => expect(intl.currentLocale).toBe('en-US'));
  it(`Current locale 2`, () => expect(intl.locale.name).toBe('English'));

  it(`Another locale`, () => {
    intl.setCurrentLocale(locale);
    expect(intl.locale.name).toBe('Russian');
  });

  it(`Another locale 2`, () => {
    intl.addLocale(locale);
    intl.currentLocale = 'ru-RU';
    expect(intl.locale.name).toBe('Russian');
  });
});
