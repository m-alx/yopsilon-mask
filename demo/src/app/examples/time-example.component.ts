import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "time-example",
  template:
    `<div class="input-wrapper">
        <input yn-mask-date="HH:mi" placeholder="hh:mm" (ynStateChange)="stateChange($event)" [(ngModel)]="timeValue" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{timeValue}}</span>
    `,
  styles:[
    `:host {
        width: 100%;
        box-sizing: border-box;
      }
    `]
})
export class TimeExampleComponent {

  timeValue: any = null;
  state: string;
  stateClass: string;

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor() { }
}
