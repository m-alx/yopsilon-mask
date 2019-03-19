# Yopsilon mask

Angular 2+ input masking directive.

#### [Demo](http://yopsilon.com/mask)

## Features

  - Date/time and numbers autoformatting and parsing using pattern for Date Value bindings.
  - Ability to create array of possible values for every part of pattern (e.g., to emulate autocomplete or to enter Date values using `dd mmm yyyy` pattern or Time using `h:mi am/pm` pattern).
  - RegExp to verify if user input is valid for each pattern section.
  - Ability to define a pattern section requiring input with variable value length. For example, `h:mi tt` pattern's `h` section length could be 1 or 2 chars. And for `dd mm yyyy` pattern for French locale short month abbreviation length could be 3 to 5 chars.
  - Date/time and number formats are internationalized. Ability to define your own custom locales. Directives are able to detect locale change - all Date values will be re-formatted and displayed in correct locale.
  - Mobile browsers support.

## Installation
```
npm install yopsilon-mask --save
```

## Usage

#### 1. Import the `YopsilonMaskModule`
Import `YopsilonMaskModule` in the NgModule of your application.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { YopsilonMaskModule } from 'yopsilon-mask';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        YopsilonMaskModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

#### 2. Use Yopsilon mask directive

For binding to Text values use [yn-mask] directive:

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<input yn-mask="+1 NNNN NNNN-NN-NN" type="text" [(ngModel)]="txtValue" />`
})
export class AppComponent {
    txtValue: string = '';
}
```

For binding to Date values use [yn-mask-date] directive:

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<input yn-mask-date="mm/dd/yyyy" type="text" [(ngModel)]="dateValue" />`
})
export class AppComponent {
  dateValue: any = new Date();
}
```

For binding to Number values use [yn-mask-number] directive:

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<input yn-mask-number="{1.2}" type="text" [(ngModel)]="numValue" />`
})
export class AppComponent {
  numValue: number = null;
}
```

### Documentation

#### 1. Common information

Directives use `Mask` class to split a pattern into sections and to process user input.
Delimiters between sections are defined as a pre-defined symbol set (static property `Mask.delimiterChars`) or any other chars, which could not be identified as a beginning of section's start.

Each section processes user input autonomously (accepts/declines a char or redirects processor to next/previous section).

After a mask pattern is parsed, each section's type is identified (`MaskSection.sectionType`) based on predefined section type set. Following parameters are defined for each section type:
  - selector: string - to define a section type (e.g. yyyy - year)
  - alpha: boolean - char values
  - digits: boolean - numeric values
  - min: number - minimum value
  - max: number - maximum value (e.g. 59 for minutes)
  - datePart: string - (optional) Date component binding. Used in `Formatter` and `Parser` Date values
  - regExp: RegExp - (optional) regexp which validates user input for a section

`MaskSection.delimiter` contains trailing delimiter for a section.

Custom section type can be created and applied (please refer to part 4. Custom section types)

#### 2. Predefined section types

Mask class includes predefined section types set:

```ts
// Predefined section types.
public static readonly sectionTypes: MaskSectionType[] = [

// Time components
{ selectors: ['HH'], numeric: true, min: 0, max: 23, datePart: 'H' },
{ selectors: ['h'], numeric: true, min: 1, max: 12, datePart: 'h' },
{ selectors: ['hh'], numeric: true, min: 1, max: 12, datePart: 'h' },
{ selectors: ['mi', 'MI'], numeric: true, min: 0, max: 59, datePart: 'mi' },
{ selectors: ['ss', 'SS'], numeric: true, min: 0, max: 59, datePart: 'ss' },
{ selectors: ['TT', 'AM', 'PM'], numeric: false, options: ['AM', 'PM'], datePart: 'tt' },
{ selectors: ['tt', 'am', 'pm'], numeric: false, options: ['am', 'pm'], datePart: 'tt' },
{ selectors: ['fff'], numeric: true, datePart: 'ms' }, // Milliseconds

// Date components
{ selectors: ['dd', 'DD'], numeric: true, min: 1, max: 31, datePart: 'd' },
{ selectors: ['mm', 'MM'], numeric: true, min: 1, max: 12, datePart: 'm' },
{ selectors: ['mmm'], numeric: false, datePart: 'm' },
{ selectors: ['MMM'], numeric: false, datePart: 'm' },
{ selectors: ['yy', 'YY'], numeric: true, min: 0, max: 99, datePart: 'yy' },
{ selectors: ['yyyy', 'YYYY'], numeric: true, min: 0, max: 9999, datePart: 'yyyy' },

// Byte (from 0 to 255) - for ip-address or network mask
{ selectors: ['b'], numeric: true, min: 0, max: 255 },

// Plus/minus
{ selectors: ['~'], numeric: false, regExp: /[-+]/ },

// Letter or digit
{ selectors: ['*'], numeric: false, regExp: /[\d\w]/ },

// Letters
{ selectors: ['l', 'L'], numeric: false, regExp: /\w/ },

// Digits
{ selectors: ['n', 'N'], numeric: false, regExp: /\d/ }

];
```

#### 3. Settings

MaskSettings class contains attributes which determine directive's behaviour upon user input:

  - placeholder: string - symbol which substitutes empty space in a pattern
  - replaceMode: boolean - replace mode emulation (symbol to be processed is selected)
  - appendPlaceholders: boolean - value is automatically extended with placeholder upon input according to chosen mask pattern
  - allowIncomplete: boolean - directive truncates bound value of input control on blur if value is incomplete
  - sectionTypes: Array<MaskSectionType> - list of your own custom section types.

*placeholder* property value should not be set to a symbol which is a member of delimiters list (e.g. space) due to unability to tell delimiter from empty section.
*whiteSpace* ('\u2000') could be used instead of space. Moreover, static property `Mask.delimiterChar` can be overridden, if there is no necessity to use that char as a delimiter.

#### 4. Custom section types

New section type can be added to list, defined in `Mask.sectionTypes` static property. These types of sections will be used by all `yn-mask` and `yn-mask-date` directives of your application.

More suitable option is to add section type to `MaskSettings` class instance which is defined in `settings` property of a directive. Types defined in `settings` property has higher priority when section type is determined.

As an example, let's define a section type, accepting only case-insensitive charset ABCEGHJKLMNPRSTVXY:

```ts
settings: YN.MaskSettings = new YN.MaskSettings('_');

constructor() {    
  this.settings.sectionTypes.push(
    { selectors: ['A'], regExp: /[ABCEGHJKLMNPRSTVXY]/i },
  );
}
```

And use it for canadian postal code with settings:

```html
<input yn-mask='ANA NAN' [yn-mask-settings]='settings' />
```

#### 5. Sections with variable length

Section value can accept variable value length.
For example, section `h` in `h:mm tt` pattern can accept values 1 to 12 (value length - 1 or 2 chars).
Difference between it and fixed-length sections:
  - cursor moves to next section only if maximum value length is reached. If length is less than maximum, User can move to the next section pressing `ArrowRight` key or pressing section delimiter char key (`:` in this example).

#### 6. Sections with options

For each section type a list of possible values can be defined (e.g., month names list).
Upon user input necessary list element is defined based on beginning of the line (before cursor's position) and section value is set to a chosen element.

Section length can vary from minumum to maximum length of elements list contains.

Example:

```ts
settings: YN.MaskSettings = new YN.MaskSettings('_');

constructor() {    
  this.settings.sectionTypes.push(
    { selectors: ['mmmm'],
      options: ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November',
                'December'] },
  );
}
```

Using it to choose month:

```html
<input yn-mask='mmmm' [yn-mask-settings]='settings' />
```

#### 7. Events

ynStateChange(e: MaskState) event - is triggered by directive state change.
Possible values:
  - MaskState.EMPTY - empty value
  - MaskState.TYPING - User started to enter some text, but value is invalid according to selected mask pattern
  - MaskState.OK - value is valid according to mask pattern

Example:

```ts
import { Component, Input } from '@angular/core';
import * as YN from 'yopsilon-mask';

@Component({
  selector: 'date-example',
  template:
    `<input yn-mask-date="date" (ynStateChange)="stateChange($event)" [(ngModel)]="dateValue" />
    <div class="state-indicator">{{state}}</div>
    `
})
export class DateExampleComponent {

  dateValue: any = null;
  state: string;  

  stateChange(state: YN.MaskState) {
    this.state = state.name;
  }
}

```

#### 8. Localization

Service `InternationalizationService` contains available locales in `locales` array. Current locale can be retrieved via `locale` property.
`currentLocale` property contains current locale code.

`MaskDateDirective` subscribes to a `InternationalizationService.onLocaleChange` event and replaces Date/Time formats with those defined in current locale. Replacing occurs if format alias is defined instead of pattern:

  - Locale.dateFormat in case of 'date';
  - Locale.timeHMFormat in case of 'time' and 'timeHM';
  - Locale.timeHMSFormat in case of 'timeHMS';
  - Locale.dateTimeHMFormat in case of 'dateTime' and 'dateTimeHM';
  - Locale.dateTimeHMSFormat in case of 'dateTimeHMS';

Instances of class `Mask` subscribe to `InternationalizationService.onLocaleChange` event to fetch localized months names for sections of *mmm* type.

You can add a custom locale via creating an instance of *Locale* class and setting it by calling method `setCurrentLocale(l:Locale)` of `InternationalizationService`.

Example:

```ts
import { Component } from '@angular/core';
import * as YN from 'yopsilon-mask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(    
    private intl: YN.InternationalizationService    
  ) {

    let locale: YN.Locale = {
      name: 'Portuguese',
      shortName: 'pt-PT',
      shortMonthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul',
                        'Ago', 'Set', 'Out', 'Nov', 'Dez'],

      longMonthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro',
                       'Dezembro'],

      shortDayNames:  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

      longDayNames:   ['Domingo', 'Segunda', 'Terça', 'Quarta',
                       'Quinta', 'Sexta', 'Sábado'],

      firstDayOfWeek: 1,

      dateFormat: 'dd-mm-yyyy',
      timeHMFormat: 'HH:mi',
      timeHMSFormat: 'HH:mi:ss',
      dateTimeHMFormat: 'dd-mm-yyyy HH:mi',
      dateTimeHMSFormat: 'dd-mm-yyyy HH:mi:ss',

      separators: [',', '.'],
      currency: '{1-12.2} €'
    };

    this.intl.setCurrentLocale(locale);
  }
}
```
