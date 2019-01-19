# Yopsilon mask

Angular 2+ input masking directive.

#### [Demo](http://yopsilon.com/mask)

## Installation
```
npm install yopsilon-mask --save
```

## Usage

#### 1. Import the `YopsilonMaskModule`
Import `YopsilonMaskModule` in the NgModule of your application.

```ts
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {YopsilonMaskModule} from "yopsilon-mask";

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

For binding to text values use [yn-mask] directive:

```ts
import {Component} from "@angular/core";

@Component({
    selector: "app-root",
    template: `<input yn-mask="+7 NNNN NNNN-NN-NN" placeholder="+7 ХХХ ХХХ-ХХ-ХХ" type="text" [(ngModel)]="txtValue" />`
})
export class AppComponent {
    txtValue: string = '';
}
```

For binding to date values use [yn-mask-date] directive:

```ts
import {Component} from "@angular/core";

@Component({
    selector: "app-root",
    template: `<input yn-mask-date="mm/dd/yyyy" placeholder="mm/dd/yyyy" type="text" [(ngModel)]="dateValue" />`
})
export class AppComponent {
  dateValue: any = new Date();
}
```
