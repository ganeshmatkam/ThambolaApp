import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-thambola-card',
  templateUrl: './thambola-card.component.html',
  styleUrls: ['./thambola-card.component.scss'],
})
export class ThambolaCardComponent implements OnInit {

  @Input()
  ticket: number[][];

  @Output()
  ticketNumberClick: EventEmitter<any> = new EventEmitter();

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
    this.ticketNumberClick.emit(this.selectedNumbers);
  }

  ngOnInit() { }

}
