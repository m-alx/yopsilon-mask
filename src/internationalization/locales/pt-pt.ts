// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { InternationalizationService } from "../internationalization.service";
import { Locale } from "../locale.class";

@Injectable()
export class LocalePt {
  constructor(private intl: InternationalizationService) {

    let locale: Locale = {
      name: "Portuguese",
      shortName: "pt-PT",
      shortMonthNames: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul",
                        "Ago", "Set", "Out", "Nov", "Dez"],

      longMonthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                       "Julho", "Agosto", "Setembro", "Outubro", "Novembro",
                       "Dezembro"],

      shortDayNames:  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],

      longDayNames:   ["Domingo", "Segunda", "Terça", "Quarta",
                       "Quinta", "Sexta", "Sábado"],

      firstDayOfWeek: 1,

      dateFormat: "dd-mm-yyyy",
      timeHMFormat: "HH:mi",
      timeHMSFormat: "HH:mi:ss",
      dateTimeHMFormat: "dd-mm-yyyy HH:mi",
      dateTimeHMSFormat: "dd-mm-yyyy HH:mi:ss",

      decimalSeparator: ",",
      thousandSeparator: ".",
      translates: {}  
    };

    this.intl.addLocale(locale);
  }
}
