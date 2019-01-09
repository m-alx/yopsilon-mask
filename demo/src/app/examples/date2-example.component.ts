import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "date2-example",
  template:
    `<div class="input-wrapper">
        <input yn-mask-date="dd mmm yyyy" placeholder="dd mmm yyyy" (ynStateChange)="stateChange($event)" [(ngModel)]="dateValue" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{dateValue}}</span>
    `,
  styles:[
    `:host {
        width: 100%;
        box-sizing: border-box;
      }
    `]
})
export class Date2ExampleComponent {

  dateValue: any = null;
  state: string;
  stateClass: string;

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor(public intl: YN.Internationalization) { }
}
