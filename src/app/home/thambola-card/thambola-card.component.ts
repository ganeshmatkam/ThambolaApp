import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-thambola-card',
  templateUrl: './thambola-card.component.html',
  styleUrls: ['./thambola-card.component.scss'],
})
export class ThambolaCardComponent implements OnInit {

  @Input()
  ticket: number[][];
  
  constructor() { }

  ngOnInit() { }

}
