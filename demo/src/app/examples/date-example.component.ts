import { Component, ViewChild } from '@angular/core';
import * as YN from 'yopsilon-mask';

@Component({
  selector: "date-example",
  template:
    `<div class="input-wrapper">
        <input #input yn-mask-date="date" autofocus [placeholder]="intl.locale.dateFormat" (ynStateChange)="stateChange($event)" [(ngModel)]="dateValue" autofocus="1" />
        <div class="state-indicator" [ngClass]="stateClass">{{state}}</div>
     </div>
     <span class="model-value">{{dateValue}}</span>
    `,
  styles:[
    `
      :host {
        width: 100%;
        box-sizing: border-box;
      }
    `]
})
export class DateExampleComponent {

  dateValue: any = null;
  state: string;
  stateClass: string;

  @ViewChild('input', {static: true, read: YN.MaskDateDirective})
  maskDateDirective: YN.MaskDateDirective;

  @ViewChild('input', {static: true })
  input: any;

  stateChange(state: YN.MaskState) {
    this.state = state.name;
    this.stateClass = state == YN.MaskState.OK ? "green" : "";
  }

  constructor(public intl: YN.InternationalizationService) { }
}
