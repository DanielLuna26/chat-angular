import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
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
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.msg = '';
  }

  get f () { return this.signInForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {
      return;
    }

    this.authService.signIn(this.signInForm).pipe(
      first()
    ).subscribe(() => {
      this.router.navigate(['']);
    }, (err) => {
      this.msg = 'Credenciales no validas';
      this.signInForm.setValue({
        email: this.signInForm.value.email,
        password: ''
      });
      console.log(this.msg);
      console.log(err);
    });
  }
  goToRegister() {
    this.router.navigate(['register']);
  }


}
