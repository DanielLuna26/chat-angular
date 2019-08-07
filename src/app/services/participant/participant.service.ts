import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HOST, PORT} from '../../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private http: HttpClient) { }

  addParticipant(user_id, room_id) {
    return this.http.post<boolean>('http://' + HOST + PORT + '/api/participants', { room_id : room_id, user_id: user_id});
  }
}
