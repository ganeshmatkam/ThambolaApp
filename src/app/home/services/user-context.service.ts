import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {

  username: string;
  gameAddress: string;

  userContext: UserContext;

  constructor() { }

  setUserContext(username: string, gameAddress: string) {
    this.userContext = new UserContext({username, gameAddress});
  }

  getUserContext(): UserContext {
    return this.userContext;
  }
}

export class UserContext {
  username: string;
  gameAddress: string;

  constructor(data?: UserContext) {
    if (data) {
      this.username = data.username;
      this.gameAddress = data.gameAddress;
    }
  }
}