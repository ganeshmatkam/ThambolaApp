import { Component, OnInit } from '@angular/core';
import { UserContextService } from '../services/user-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  gameAddress = '192.168.43.27';
  username: string;

  constructor(private userContextSvc: UserContextService, private router: Router) { }

  login() {
    this.userContextSvc.setUserContext(this.username, this.gameAddress);
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {}

}
