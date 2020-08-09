import { Component, OnInit } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { ToastController } from '@ionic/angular';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { UserContextService, UserContext } from './services/user-context.service';
import { Router } from '@angular/router';

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

  allUsers: { user: string; createdAt: number; ticket: number[][]; choosenNumbers: number[] }[] = [];
  allUserIds: string[] = [];

  userContext: UserContext;

  config: SocketIoConfig = {
    url: '',
    options: {},
  };
  newNumber: number;
  audio: any;

  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private data: DataService,
    private userContextSvc: UserContextService,
    private router: Router
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

    this.socket.fromEvent('adminInfo-user-ticket-number-click').subscribe((userData: any) => {
      console.log('Admin: User changed a ticket: ', userData);
      const userIx = this.allUserIds.indexOf(userData.user);
      if (userIx !== -1) {
        this.allUsers[userIx].createdAt = userData.createdAt;
        this.allUsers[userIx].choosenNumbers = userData.choosenNumbers;
      } else {
        this.allUsers.push(userData);
        this.allUserIds.push(userData.user);
      }
    });

    this.socket.fromEvent('new-picked-number').subscribe((newNumber: any) => {
      this.playAudio();
      this.newNumber = +newNumber;
    });
  }

  loadAudio() {
    this.audio = new Audio();
    this.audio.src = '/assets/sounds/notification.mp3';
    this.audio.load();
  }

  playAudio(){
    this.audio.play();
  }


  onTicketNumberClick(selectedNumbers: number[]) {
    this.socket.emit('user-ticket-number-click', {
      username: this.currentUser,
      selectedNumbers,
      ticket: this.thambolaTicket
    });
  }

  ngOnInit() {
    this.userContext = this.userContextSvc.getUserContext();
    console.log('usercontext: ', this.userContextSvc.getUserContext());
    if (this.userContext) {
      this.currentUser = this.userContext.username;
    } else {
      this.router.navigateByUrl('/home/login');
    }
    this.initSocket();
    this.subscribeSocketEvents();
    this.loadAudio();
  }
}
