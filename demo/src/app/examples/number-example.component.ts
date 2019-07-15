import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "number-example",
  template:
    `<div class="input-wrapper">
        <input [yn-mask-number]="format" (ynStateChange)="stateChange($event)" [(ngModel)]="numValue" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{numValue}}</span>
    `,
  styles:[
    `:host {
        width: 100%;
        box-sizing: border-box;
      }
      input {
        text-align: right;
      }
  `]
})
export class NumberExampleComponent {

  format: string = "{N1-6.2}";

  numValue: number = null;
  state: string;
  stateClass: string;

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }
}
