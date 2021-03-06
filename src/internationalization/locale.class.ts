export class Locale {

  public name: string;
  public shortName: string;

  public shortMonthNames: Array<string> = [];
  public longMonthNames: Array<string> = [];

  public shortDayNames: Array<string> = [];
  public longDayNames: Array<string> = [];

  public firstDayOfWeek: number = 0;

  public dateFormat: string;
  public timeHMFormat: string;
  public timeHMSFormat: string;
  public dateTimeHMFormat: string;
  public dateTimeHMSFormat: string;

  public separators: Array<string> = [];
  public currency: string = "";

  public translates: { [id: string]: any } = { };
}
