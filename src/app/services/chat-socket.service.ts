import { Injectable } from '@angular/core';
import * as Ws from '@adonisjs/websocket-client';
import { HOST, PORT} from '../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  ws: any;
  chat: any;
  constructor() { }

  startSocket () {
    const token = localStorage.getItem('token');
    this.ws = Ws('ws://' + HOST + PORT, true).withJwtToken(token).connect();
    this.subscribeChannel();
  }

  private subscribeChannel () {
    this.chat = this.ws.subscribe('chat');
    this.chat.on('error', event => {
      console.log(event);
    });
  }

  emitNewUser() {
    this.chat.emit('new:user', true);
  }

  emitAddedUser() {
    this.chat.emit('added:user', true);
  }

  emitNewGroup() {
    this.chat.emit('new:group', true);
  }

  emitTypeChat(data) {
    this.chat.emit('type:chat', data);
  }

  emitTypeGroup(data) {
    this.chat.emit('type:group', data);
  }

  emitNewMessage(data) {
    this.chat.emit('new:message', data);
  }

  emitLogoutUser() {
    this.chat.emit('logout:user', true);
  }

}
