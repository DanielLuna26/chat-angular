import { Routes } from '@angular/router';
import { AuthGuardService } from '../helpers/auth-guard.service';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { GroupComponent } from '../components/group/group.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { AddGroupComponent } from '../components/add-group/add-group.component';
import { UserMessageComponent } from '../components/user-message/user-message.component';

export const ROUTES: Routes  = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: SidebarComponent, canActivate: [AuthGuardService], children: [
    { path: 'group', component: AddGroupComponent  },
    { path: 'group/:id', component: GroupComponent  },
    { path: 'user/:id', component: UserMessageComponent }
  ] }
];
