import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group/group.service';
import { Group } from '../../models/group';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { ParticipantService } from '../../services/participant/participant.service';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  groupForm: FormGroup;
  group: Group;
  currentUser: User;
  hiddenUsers = true;
  users: User[] = [];
  socketids: string [] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private chat: ChatSocketService,
    private groupService: GroupService,
    private userService: UserService,
    private participantService: ParticipantService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.socketids = [];
    this.authService.currentUser().subscribe(user => {
      this.currentUser = user;
      this.userService.getUsers(this.currentUser.id).subscribe(users => {
        this.users = users;
        users.forEach(userS => {
          this.socketids.push(userS.socket_id);
        });
      });
    });
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['m']
    });
  }

  get f () { return this.groupForm.controls; }

  onSubmit() {
    if (this.groupForm.invalid) {
      return;
    }
    this.hiddenUsers = false;
    this.groupService.createGroup(this.groupForm).subscribe(group => {
      this.group = group;
      this.participantService.addParticipant(this.currentUser.id, this.group.id).subscribe(data => {
      });
    });
  }

  addParticipant(user) {
    this.participantService.addParticipant(user.id, this.group.id).subscribe(data => {
      const index = this.users.indexOf(user);
      this.users.splice(index, 1);
      this.chat.emitNewGroup();
    });
  }

  goToGroup() {
    this.router.navigate([this.group.id], {relativeTo: this.route});
  }
}
