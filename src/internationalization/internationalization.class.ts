// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs/Rx";

import { Locale } from "./locale.class";

@Injectable()
export class Internationalization {

  public locales: Array<Locale> = [];
  public currentLocaleName: string;

  // При изменении локализации
  private _onLocaleChanged: BehaviorSubject<Locale> = new BehaviorSubject<Locale>(this.currentLocale);
  public readonly onLocaleChanged: Observable<Locale> = this._onLocaleChanged.asObservable();

  //
  public addLocale(locale: Locale) {
    if(!this.locales.find(l => l.shortName == locale.shortName))
      this.locales.push(locale);
  }

  public get currentLocale(): Locale {
    let res = this.locales.find(l => l.shortName == this.currentLocaleName);
    if(!res)
      return this.locales[0];
    else
      return res;
  }

  public setCurrentLocale(name: string) {
    this.currentLocaleName = name;
    this._onLocaleChanged.next(this.currentLocale);
  }

  public get shortMonthNames() {
    return this.currentLocale.shortMonthNames;
  }

  public isDigit(c: string): boolean {
    return c.length === 1 && c.match(this.currentLocale.digits) != null;
  }

  public isLetter(c: string): boolean {
    return c.length === 1 && c.match(this.currentLocale.letters) != null;
  }

  constructor() {

    this.locales.push(
      {
        name: "English",
        shortName: "en-US",

        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                          "Aug", "Sep", "Oct", "Nov", "Dec"],

        longMonthNames: ["January", "February", "March", "April", "May", "June",
                         "July", "August", "September", "October", "November",
                         "December"],

        shortDayNames:  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        longDayNames:   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                         "Friday", "Saturday"],

        firstDayOfWeek: 0,
        dateFormat: "mm/dd/yyyy",
        timeHMFormat: "hh:mi am",
        timeHMSFormat: "hh:mi:ss am",
        dateTimeHMFormat: "mm/dd/yyyy hh:mi am",
        dateTimeHMSFormat: "mm/dd/yyyy hh:mi:ss am",
        decimalSeparator: ".",
        thousandSeparator: ",",
        digits: /\d/,
        letters: /[a-z]/i
      }
    );

    this.currentLocaleName = this.locales[0].shortName;
  }
}
