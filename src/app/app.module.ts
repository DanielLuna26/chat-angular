import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Helpers
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AppComponent } from './components/app/app.component';
// Routes
import { ROUTES } from './routes/routes';
// Services
import { AuthService } from './services/auth/auth.service';
import { ChatSocketService } from './services/chat-socket.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GroupComponent } from './components/group/group.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserService } from './services/user/user.service';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { GroupService } from './services/group/group.service';
import { UserMessageComponent } from './components/user-message/user-message.component';
import { ChatService } from './services/chat/chat.service';
import { ParticipantService } from './services/participant/participant.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GroupComponent,
    SidebarComponent,
    AddGroupComponent,
    UserMessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    ChatSocketService,
    UserService,
    GroupService,
    ChatService,
    ParticipantService, {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
