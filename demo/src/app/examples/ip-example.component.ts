import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "ip-example",
  template:
    `<div class="input-wrapper">
        <input yn-mask="b.b.b.b" placeholder="0.0.0.0" [yn-mask-options]="options" (ynStateChange)="stateChange($event)" [(ngModel)]="txtValue" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{txtValue}}</span>
    `,
  styles:[
    `:host {
        width: 100%;
        box-sizing: border-box;
      }
    `]
})
export class IpExampleComponent {

  txtValue: string = "";
  state: string;
  stateClass: string;

  options: YN.MaskOptions = new YN.MaskOptions(" ", false);

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor() {
    this.options.appendPlaceholders = false;
  }
}
