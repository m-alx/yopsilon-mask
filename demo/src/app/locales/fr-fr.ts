// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';
import * as YN from 'yopsilon-mask';

@Injectable()
export class LocaleFr {
  constructor(private intl: YN.InternationalizationService) {

    let locale: YN.Locale = {
      name: "French",
      shortName: "fr-FR",
      shortMonthNames: ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil",
                        "Août", "Sept", "Oct", "Nov", "Déc"],

      longMonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                       "Juillet", "Août", "Septembre", "Octobre", "Novembre",
                       "Décembre"],

      shortDayNames:  ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],

      longDayNames:   ["Dimanche", "Lundi", "Mardi", "Mercredi",
                       "Jeudi", "Vendredi", "Samedi"],

      firstDayOfWeek: 1,

      dateFormat: "dd/mm/yyyy",
      timeHMFormat: "HH:mi",
      timeHMSFormat: "HH:mi:ss",
      dateTimeHMFormat: "dd/mm/yyyy HH:mi",
      dateTimeHMSFormat: "dd/mm/yyyy HH:mi:ss",

      separators: [",", "."],
      currency: "{N1-12.2} €",

      translates: {}
    };

    this.intl.addLocale(locale);
  }
}
