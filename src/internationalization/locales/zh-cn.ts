// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { Internationalization } from "../internationalization.class";
import { Locale } from "../locale.class";

@Injectable()
export class LocaleChinese {
  constructor(private intl: Internationalization) {

    let locale: Locale = {
      name: "Chinese",
      shortName: "zh-CN",
      shortMonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月",
                        "8月", "9月", "10月", "11月", "12月"],

      longMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月",
                       "七月", "八月", "九月", "十月", "十一月",
                       "十二月"],

      shortDayNames:  ["日", "一", "二", "三", "四", "五", "六"],

      longDayNames:   ["星期日", "星期一", "星期二", "星期三",
                       "星期四", "星期五", "星期六"],

      firstDayOfWeek: 1,

      dateFormat: "yyyy年mm月dd日",
      timeHMFormat: "HH时mi分",
      timeHMSFormat: "HH时mi分ss秒",
      dateTimeHMFormat: "yyyy年mm月dd日 H时mi分",
      dateTimeHMSFormat: "yyyy年mm月dd日 HH时mi分ss秒",

      decimalSeparator: ".",
      thousandSeparator: ",",
      digits: /[0-9]/,
      letters: /[a-z]/i
    };

    this.intl.addLocale(locale);
  }
}
