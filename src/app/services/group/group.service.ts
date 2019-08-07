import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../../models/group';
import { FormGroup } from '@angular/forms';
import { HOST, PORT} from '../../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  createGroup(f: FormGroup): Observable<Group> {
    return this.http.post<Group>('http://' + HOST + PORT + '/api/rooms', f.value);
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('http://' + HOST + PORT + '/api/rooms');
  }

  getGroup(id): Observable<Group> {
    return this.http.get<Group>('http://' + HOST + PORT + '/api/rooms/' + id);
  }

  getUserGroup(): Observable<Group[]> {
    return this.http.get<Group[]>('http://' + HOST + PORT + '/api/users/0/rooms');
  }

  addMessage(id, message, file: File) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file, file.name);
    }
    formData.append('message', JSON.stringify(message));
    return this.http.put<any>('http://' + HOST + PORT + '/api/rooms/' + id, formData );
  }
}
