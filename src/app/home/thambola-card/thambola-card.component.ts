import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-thambola-card',
  templateUrl: './thambola-card.component.html',
  styleUrls: ['./thambola-card.component.scss'],
})
export class ThambolaCardComponent implements OnInit {

  @Input()
  ticket: number[][];

  selectedNumbers: number[] = [];

  constructor() { }

  onNumberClick(num: number, rowIndex: number, colIndex: number) {
    if (num) {
      const numIndex = this.selectedNumbers.indexOf(num);
      if (numIndex !== -1) {
        this.selectedNumbers.splice(numIndex, 1);
      } else {
        this.selectedNumbers.push(num);
      }
    }
  }

  ngOnInit() { }

}
