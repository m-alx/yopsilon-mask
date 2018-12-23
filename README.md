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
