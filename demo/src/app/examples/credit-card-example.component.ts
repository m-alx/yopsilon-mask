import { Component, Input } from "@angular/core";
import * as YN from "yopsilon-mask";

@Component({
  selector: "credit-card-example",
  template:
    `<div class="input-wrapper">
        <input [yn-mask]="mask" [placeholder]="mask" [yn-mask-settings]="settings" (ynStateChange)="stateChange($event)" [(ngModel)]="txtValue" (ngModelChange)="change($event)" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{card}}&nbsp;{{txtValue}}</span>
    `,
  styles:[
    `:host {
        width: 100%;
        box-sizing: border-box;
      }
    `]
})
export class CreditCardExampleComponent {

  mask: string = "NNNN NNNN NNNN NNNN";

  txtValue: string = "";
  state: string;
  stateClass: string;

  card: string = "";

  settings: YN.MaskSettings = new YN.MaskSettings("_", true);

  cardTypes: Array<any> = [
    { regExp: /3\d/, cardType: "American Express", mask: "NNN NNNNNN NNNNN" },
    { regExp: /4\d/, cardType: "Visa", mask: "NNNN NNNN NNNN NNNN" },
    { regExp: /5[1-5]/, cardType: "MasterCard", mask: "NNNN NNNN NNNN NNNN" },
    { regExp: /6\d/, cardType: "Discover", mask: "NNNN NNNN NNNN NNNN" }
  ];

  change(s) {
    if(s.length < 2)
      return;

    let s2 = s.substring(0, 2);

    this.card = "";
    this.cardTypes.some(ct => {
      if(s2.match(ct.regExp)) {
        this.mask = ct.mask;
        this.card = ct.cardType;
        return true;
      }
    });
  }

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor() {
    this.settings.appendPlaceholders = true;
  }
}
