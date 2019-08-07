import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSocketService } from '../../services/chat-socket.service';
import { error } from 'util';
import { HOST, PORT } from '../../helpers/global';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent implements OnInit {
  host = HOST;
  port = PORT;
  user: User;
  privateMessage: any;
  currentUser: User;
  msgForm: FormGroup;
  socketids: string[] = [];
  messages: Array<any> = new Array<any>();
  isTyping = true;
  fileToUpload: File = null;

  constructor(
    private chat: ChatSocketService,
    private chatService: ChatService,
    private userSerice: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.msgForm = this.formBuilder.group({
      message: [''],
      file: null
    });

    this.socketids = [];
    this.authService.currentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.route.params.subscribe(params => {
      this.userSerice.getUser(params.id).subscribe(user => {
        this.user = user;
        this.socketids.push(user.socket_id);
        this.chatService.getChat(this.user.id).subscribe(chat => {
          this.privateMessage = chat;
          if (this.privateMessage.messages !== '[]') {
            this.messages = this.privateMessage.messages;
          }
          this.isTyping = true;
        });
      });
    });
    this.chat.chat.on('new:message', (data) => {
      this.messages.push(data);
    });
    this.chat.chat.on('new:user', () => {
      this.socketids = [];
      this.route.params.subscribe(params => {
        this.userSerice.getUser(params.id).subscribe(user => {
          this.user = user;
          this.socketids.push(user.socket_id);
        });
      });
    });

    this.chat.chat.on('type:chat', (data) => {
      if (data.id === this.user.id) {
        this.isTyping = false;
      }
      if (!this.isTyping) {
        setTimeout(() => { this.isTyping = true; return; }, 1500);
      }
    });

    this.msgForm.valueChanges.subscribe(data => {
      this.chat.emitTypeChat(this.currentUser.id);
    }, err => this.isTyping = true);
  }

  get f () { return this.msgForm.controls; }

  onFileChange(files) {
    this.fileToUpload = files.item(0);
  }

  onSubmit() {
    const msg: any = {
      user_id: this.currentUser.id,
      username: this.currentUser.username,
      body: this.msgForm.value.message
    };
    this.msgForm.setValue({
      message: '',
      file: null
    });
    this.chatService.addMessageChat(this.user.id, msg, this.fileToUpload).subscribe(result => {
      this.messages.push(result);
      const data = {
        message: result,
        socketids: this.socketids
      };
      this.fileToUpload = null;
      this.chat.emitNewMessage(data);
      this.chat.emitNewGroup();
    });
  }

}
