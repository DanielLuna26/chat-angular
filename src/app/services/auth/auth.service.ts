import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { HOST, PORT} from '../../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(): boolean {
    if (!localStorage.getItem('token')) {
      return false;
    }
    return true;
  }

  signIn(f: FormGroup) {
    return this.http.post<any>('http://' + HOST + PORT + '/api/signin', f.value).pipe(
      map(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      }, err => {
        console.log(err);
      })
    );
  }

  signUp(f: FormGroup): Observable<boolean> {
    return this.http.post<boolean>('http://' + HOST + PORT + '/api/signup', f.value);
  }

  currentUser() {
    return this.http.get<User>('http://' + HOST + PORT + '/api/currentuser');
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
