import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "phone-example",
  template:
    `<div class="input-wrapper">
        <input yn-mask="+1 NNN NNN-NN-NN" placeholder="+1 XXX XXX-XX-XX" (ynStateChange)="stateChange($event)" [(ngModel)]="txtValue" />
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
export class PhoneExampleComponent {

  txtValue: string = "";
  state: string;
  stateClass: string;

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor() { }
}
