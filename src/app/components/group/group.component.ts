import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { GroupService } from '../../services/group/group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Group } from '../../models/group';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSocketService } from '../../services/chat-socket.service';
import {HOST, PORT} from '../../helpers/global';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  host = HOST;
  port = PORT;
  messages: JSON[] = [];
  currentUser: User;
  msgForm: FormGroup;
  user: User;
  group: Group;
  users:  User[] = [];
  socketids: string[] = [];
  isTyping = true;
  fileToUpload: File = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private chat: ChatSocketService
  ) { }

  ngOnInit() {
    this.socketids = [];
    this.authService.currentUser().subscribe( user => {
      this.currentUser = user;
    });
    this.msgForm = this.formBuilder.group({
      message: [''],
      file: ['']
    });
    this.route.params.subscribe(param => {
      this.groupService.getGroup(param.id).subscribe(group => {
        this.group = group;
        if (!group) {
          this.router.navigate(['']);
          return;
        }
        if (group.messages) {
          this.messages = group.messages;
        }
        this.userService.getGroupUsers(this.group.id).subscribe(users => {
          this.users = users;
          this.socketids = [];
          this.users.forEach((user, i) => {
            if (user.id !== this.currentUser.id) {
              this.socketids[i] = user.socket_id;
            }
          });
        });
      }, err => {
        this.router.navigate(['']);
      });
      this.msgForm.setValue({
        message: '',
        file: null
      });
      this.isTyping = true;
    });
    this.chat.chat.on('new:message', (data) => {
      console.log(data);
      this.messages.push(data);
    });
    this.chat.chat.on('new:user', () => {
      this.socketids = [];
      this.route.params.subscribe(param => {
        this.groupService.getGroup(param.id).subscribe(group => {
          this.group = group;
          if (group.messages) {
            this.messages = group.messages;
          }
          this.userService.getGroupUsers(this.group.id).subscribe(users => {
            this.users = users;
            this.socketids = [];
            this.users.forEach((user, i) => {
              if (user.id !== this.currentUser.id) {
                this.socketids[i] = user.socket_id;
              }
            });
          });
        });
      });
    });

    this.chat.chat.on('type:group', data => {
      console.log(data);
      if (data.group === this.group.id) {
        this.user = data.user;
        this.isTyping = false;
      }
      if (!this.isTyping) {
        setTimeout(() => { this.isTyping = true; return; }, 1500);
      }
    });

    this.msgForm.valueChanges.subscribe(() => {
      const data = {
        user : this.currentUser,
        group: this.group.id
      };
      this.chat.emitTypeGroup(data);
    });
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
    this.groupService.addMessage(this.group.id, msg, this.fileToUpload).subscribe(
      data => {
        this.messages.push(data);
        const dataMessage = {
          message: data,
          socketids: this.socketids
        };
        this.fileToUpload = null;
        this.chat.emitNewMessage(dataMessage);
      }, err => {
        console.log(err);
      }
    );
  }

}
