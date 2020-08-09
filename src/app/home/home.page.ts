import { Component, OnInit } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { ToastController } from '@ionic/angular';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { UserContextService, UserContext } from './services/user-context.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  message = '';
  messages = [];
  currentUser = '';
  thambolaTicket: number[][];

  userContext: UserContext;

  config: SocketIoConfig = {
    url: '',
    options: {},
  };

  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private data: DataService,
    private userContextSvc: UserContextService
  ) {

  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  initSocket() {
    if (this.userContext && this.userContext.gameAddress) {
      this.socket.disconnect();
      this.config.url = `http://${this.userContext.gameAddress}:3001`;
      this.socket = new Socket(this.config);
      this.socket.connect();
    }
    this.socket.emit('set-name', this.currentUser);
  }

  subscribeSocketEvents() {
    this.socket.fromEvent('users-changed').subscribe((data: any) => {
      console.log('Users changed event: ', data);
      const user = data.user;
      if (data.event === 'left' && data.user) {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });

    this.socket.fromEvent('message').subscribe((message: any) => {
      this.messages.push(message);
    });

    this.socket.fromEvent('new-thambola-ticket').subscribe((data: any) => {
      console.log('New Thambola ticket: ', data);
      this.thambolaTicket = data.ticket;
      console.log(data);
    });
  }

  ngOnInit() {
    this.userContext = this.userContextSvc.getUserContext();
    console.log('usercontext: ', this.userContextSvc.getUserContext());
    if (this.userContext) {
      this.currentUser = this.userContext.username;
    } else {
      this.currentUser = 'Test Admin';
    }
    this.initSocket();
    this.subscribeSocketEvents();
  }
}
