# Yopsilon mask

Angular 2+ input masking directive.

#### [Demo](http://yopsilon.com/mask)

# Install
```npm install yopsilon-mask --save```

## Usage

#### 1. Import the `YopsilonMaskModule`
Import `YopsilonMaskModule` in the NgModule of your application.

```ts
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from '@angular/core';
import {YopsilonMaskModule} from 'yopsilon-mask';

@NgModule({
    imports: [
        BrowserModule,
        YopsilonMaskModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

#### 2. Use Yopsilon mask directive with selector yn-mask

```js
import {Component} from '@angular/core';

@Component({
    selector: 'simple-yn',
    template: `
<input yn-mask="mm/dd/yyyy" placeholder="mm/dd/yyyy" type="text" /><br />
`
})
export class SimpleYnComponent {
    //
}
```
