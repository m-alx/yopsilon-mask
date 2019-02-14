// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import * as YN from 'yopsilon-mask';

@Injectable()
export class LocaleRu {
  constructor(private intl: YN.InternationalizationService) {

    let locale: YN.Locale = {
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
      currency: "{1-12.2} ₽",

      translates: {}
    };

    this.intl.addLocale(locale);
  }
}
