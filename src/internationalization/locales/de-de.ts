// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { InternationalizationService } from "../internationalization.service";
import { Locale } from "../locale.class";

@Injectable()
export class LocaleDe {
  constructor(private intl: InternationalizationService) {

    let locale: Locale = {
      name: "German",
      shortName: "de-DE",
      shortMonthNames: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul",
                        "Aug", "Sep", "Okt", "Nov", "Dez"],

      longMonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni",
                       "Juli", "August", "September", "Oktober", "November",
                       "Dezember"],

      shortDayNames:  ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],

      longDayNames:   ["Sonntag", "Montag", "Dienstag", "Mittwoch",
                       "Donnerstag", "Freitag", "Samstag"],

      firstDayOfWeek: 1, 

      dateFormat: "dd.mm.yyyy",
      timeHMFormat: "HH:mi",
      timeHMSFormat: "HH:mi:ss",
      dateTimeHMFormat: "dd.mm.yyyy HH:mi",
      dateTimeHMSFormat: "dd.mm.yyyy HH:mi:ss",

      separators: [",", " "],
      currency: "{1-12.2} €",
      translates: {}
    };

    this.intl.addLocale(locale);
  }
}
