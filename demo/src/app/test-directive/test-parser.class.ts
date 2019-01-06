import { MaskSection, MaskSectionType } from "yopsilon-mask";

export class TestParser {

    public static formatDate(sections: Array<MaskSection>, date: any): string {

      if(date == null || date == undefined)
        return "";

      let res: string = "";
      for(let i = 0; i < sections.length; i++) {

        let section: MaskSection = sections[i];
        let datePart = section.sectionType.datePart;

        let n: number = NaN;

        if(datePart == "yyyy")
          n = date.getFullYear();

        if(datePart == "yy") {
          n = date.getFullYear();
          if( n >= 2000)
            n-=2000;
          else
            n-=1900;
        }

        if(datePart == "m")
          n = date.getMonth() + 1;

        if(datePart == "d")
          n = date.getDate();

        if(datePart == "H")
          n = date.getHours();

        if(datePart == "h") {
          n = date.getHours();

          if(n = 0)
            n = 12;
          else
            if(n > 12)
              n -= 12;
        }

        if(datePart == "mi")
          n = date.getMinutes();

        if(datePart == "ss")
          n = date.getSeconds();

        if(datePart == "ms")
          n = date.getMilliseconds();

        if(datePart == "tt")
          n = date.getHours() >= 12 ? 2 : 1;

        let s: string = "";

        if(section.hasVariants())
          s = section.sectionType.variants[n - 1];
        else
          s = section.autoCorrectValue(n + "");

        res += s + section.delimiter;


        //if(datePart == null) // Не является частью даты
          //continue;

        // let v = section.extractSectionValue(res, sectionPos);
        // sectionPos = v.nextSectionPos();



        //console.log(section.section, s);
      }

      return res;
    }

    public static parseDate(sections: Array<MaskSection>, value: string): any {

      let sectionPos = 0;
      let res = value;

      let d: number = 1;
      let m: number = 1;
      let y: number = 1900;

      let hh: number = 0;
      let mi: number = 0;
      let ss: number = 0;
      let ms: number = 0;

      let tt: string = "";

      for(let i = 0; i < sections.length; i++) {

        let section: MaskSection = sections[i];
        let datePart = section.sectionType.datePart;

        if(datePart == null) // Не является частью даты
          continue;

        let v = section.extractSectionValue(res, sectionPos);
        sectionPos = v.nextSectionPos();

        // Значение секции
        let s: string = v.sectionValue.value();

        let n: number;
        n = NaN;

        if(section.isNumeric()) {
          n = section.numericValue(s);
          if(n < section.sectionType.min || n > section.sectionType.max)
            return null;
        }
        else
          if(section.hasVariants()) {
            n = section.sectionType.variants.indexOf(s);
            if(n < 0)
              return  null;
            n++; // Индекс начинается с нуля
          }

        if(n == NaN)
          return null;

        // Время...
        if(datePart == "H")
          hh = n;

        if(datePart == "h") {
          hh = n;
          if(hh == 12)
            hh = 0;
        }

        if(datePart == "tt")
          tt = s;

        if(datePart == "mi")
          mi = n;

        if(datePart == "ss")
          ss = n;

        if(datePart == "ms")
          ms = n;

        // Дата...
        if(datePart == "d")
          d = n;

        if(datePart == "m")
          m = n;

        if(datePart == "yy") {
          if(n < 30)
            y = 2000 + n;
          else
            y = 1900 + n;
        }

        if(datePart == "yyyy")
          y = n;
      }

      if(tt.toLowerCase() == "pm")
        hh += 12;

      return new Date(y, m - 1, d, hh, mi, ss, ms);
    }
}
