import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HOST, PORT} from '../../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(id): Observable<User[]> {
    return this.http.get<User[]>('http://' + HOST + PORT + '/api/users').pipe(
      map(users => users.filter(user => user.id !== id))
    );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>('http://' + HOST + PORT + '/api/users/' + id);
  }

  getGroupUsers(id) {
    return this.http.get<User[]>('http://' + HOST + PORT + '/api/groups/' + id + '/users' );
  }
}
