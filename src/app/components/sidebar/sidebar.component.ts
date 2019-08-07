import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { map } from 'rxjs/operators';
import { ChatSocketService } from '../../services/chat-socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '../../models/group';
import { GroupService } from '../../services/group/group.service';
import { ParticipantService } from '../../services/participant/participant.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  users: User[] = [];
  currentUser: User;
  groups: Group[] = [];
  socketids: string[] = [];

  constructor(private userService: UserService,
    private authService: AuthService,
    private chat: ChatSocketService,
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private participantService: ParticipantService) { }

  ngOnInit() {
    Notification.requestPermission();
    this.chat.startSocket();
    this.authService.currentUser().subscribe( async (user) => {
      this.currentUser = await user;
      this.userService.getUsers(this.currentUser.id).subscribe(users => {
        this.users = users;
      });
      this.groupService.getUserGroup().subscribe(groups => {
        this.groups = groups;
      });
    });
    this.chat.emitNewUser();
    this.setUpChat();
  }

  setUpChat() {
    this.chat.chat.on('new:user', data => {
      const notify = new Notification('New user', {
        body: 'Active ' + data.username
      });
      this.userService.getUsers(this.currentUser.id).subscribe(users => {
        this.users = users;
      });
    });
    this.chat.chat.on('logout:user', data => {
      this.userService.getUsers(this.currentUser.id).subscribe(users => {
        this.users = users;
      });
      const notify = new Notification('Left user', {
        body: 'Left ' + data.username
      });
    });
    this.chat.chat.on('new:group', data => {
      this.groupService.getUserGroup().subscribe(groups => {
        this.groups = groups;
      });
    });
    this.chat.chat.on('new:message', data => {
      const notify = new Notification('New message', {
        body: data.username + ': ' + data.body
      });
      this.groupService.getUserGroup().subscribe(groups => {
        this.groups = groups;
      });
    });
  }

  goToGroup(id) {
    this.router.navigate(['group/' + id]);
  }

  goToUser(id) {
    this.router.navigate(['user/' + id]);
  }

  goAddGroup() {
    this.router.navigate(['group']);

  }

  logOut() {
    this.chat.emitLogoutUser();
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.chat.chat.close();
  }

}
