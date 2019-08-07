import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ChatService } from '../../services/chat/chat.service';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signUpForm: FormGroup;
  submitted = false;
  msg: string;
  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit( ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']);
      return;
    }
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.msg = '';
  }

  get f () { return this.signUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    this.authService.signUp(this.signUpForm).pipe(
      first()
    ).subscribe(() => {
      this.router.navigate(['login']);
    }, (err) => {
      this.msg = 'Email no valido';
      console.log(this.msg);
      console.log(err);
    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

}
