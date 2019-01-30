// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs/Rx";

import { Locale } from "./locale.class";

@Injectable()
export class InternationalizationService {

  // Locales list
  public locales: Array<Locale> = [];

  // On locale change event
  private _onLocaleChange: BehaviorSubject<Locale> = new BehaviorSubject<Locale>(this.locale);
  public readonly onLocaleChange: Observable<Locale> = this._onLocaleChange.asObservable();

  // Current locale
  public _currentLocale: string;

  public get currentLocale(): string {
    return this._currentLocale;
  }

  public set currentLocale(shortName: string) {
    this._currentLocale = shortName;
    this._onLocaleChange.next(this.locale);
  }

  public setCurrentLocale(l: Locale) {
    let res = this.locales.find(l => l.shortName == this._currentLocale);
    if(!res)
      this.locales.push(l);

    this.currentLocale = l.shortName;
  }

  // Adding a locale
  public addLocale(locale: Locale) {
    if(!this.locales.find(l => l.shortName == locale.shortName))
      this.locales.push(locale);
  }

  //
  public get locale(): Locale {
    let res = this.locales.find(l => l.shortName == this._currentLocale);
    if(!res)
      return this.locales[0];
    else
      return res;
  }

  public get shortMonthNames() {
    return this.locale.shortMonthNames;
  }

  constructor() {

    this.locales.push(
      {
        name: "English",
        shortName: "en-US",

        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                          "Aug", "Sep", "Oct", "Nov", "Dec"],

        longMonthNames:  ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November",
                          "December"],

        shortDayNames:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        longDayNames:    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                          "Friday", "Saturday"],

        firstDayOfWeek: 0,
        dateFormat: "mm/dd/yyyy",
        timeHMFormat: "hh:mi am",
        timeHMSFormat: "hh:mi:ss am",
        dateTimeHMFormat: "mm/dd/yyyy hh:mi am",
        dateTimeHMSFormat: "mm/dd/yyyy hh:mi:ss am",

        separators: [",", "."],
        currency: "${1.2}",
        
        translates: {}
      }
    );

    this.currentLocale = this.locales[0].shortName;
  }
}
