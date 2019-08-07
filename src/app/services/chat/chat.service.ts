import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HOST, PORT} from '../../helpers/global';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChat(id) {
    return this.http.get<any>('http://' + HOST + PORT + '/api/chat/' + id);
  }

  addMessageChat(id, message, file: File) {
    const formData = new FormData();
    if (file ) {
      formData.append('file', file, file.name);
    }
    formData.append('message', JSON.stringify(message));
    return this.http.post<any>('http://' + HOST + PORT + '/api/chat/' + id, formData);
  }
}
