// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import { InternationalizationService } from "../internationalization.service";
import { Locale } from "../locale.class";

@Injectable()
export class LocaleEs {
  constructor(private intl: InternationalizationService) {

    let locale: Locale = {
      name: "Spanish",
      shortName: "es-ES",
      shortMonthNames: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul",
                        "Ago", "Sep", "Oct", "Nov", "Dic"],

      longMonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre",
                       "Diciembre"],

      shortDayNames:  ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],

      longDayNames:   ["Domingo", "Lunes", "Martes", "Miércoles",
                       "Jueves", "Viernes", "Sábado"],

      firstDayOfWeek: 1,

      dateFormat: "dd/mm/yyyy",
      timeHMFormat: "HH:mi",
      timeHMSFormat: "HH:mi:ss",
      dateTimeHMFormat: "dd/mm/yyyy HH:mi",
      dateTimeHMSFormat: "dd/mm/yyyy HH:mi:ss",

      decimalSeparator: ",",
      thousandSeparator: ".",
      translates: {}  
    };

    this.intl.addLocale(locale);
  }
}
