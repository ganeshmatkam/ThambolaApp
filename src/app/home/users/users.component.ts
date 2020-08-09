import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  @Input()
  users: {user: string; createdAt: number; ticket: number[][]; choosenNumbers: number[]}[] = [];

  constructor() { }

  ngOnInit() {}

}
