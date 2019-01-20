import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "canadian-postal-code-example",
  template:
    `<div class="input-wrapper">
        <input [yn-mask]="mask" placeholder="A0A-0A0" [yn-mask-settings]="settings" (ynStateChange)="stateChange($event)" [(ngModel)]="txtValue" />
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
export class CanadianPostalCodeExampleComponent {

  mask: string = "ANA NAN";

  txtValue: string = "";
  state: string;
  stateClass: string;

  settings: YN.MaskSettings = new YN.MaskSettings("_", true);

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor() {
    this.settings.sectionTypes.push(
      { selectors: ["A"], digits: false, alpha: true, regExp: /[ABCEGHJKLMNPRSTVXY]/i },
    );
  }
}
