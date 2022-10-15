import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  readonly uri: string = 'http://localhost:3000/chat';

  constructor() {
    this.socket = io.io(this.uri);
  }

  // Initialise a socket
  initSocket(){
    this.socket = io.io(this.uri);
    return ()=>{this.socket.disconnect();}
  }

  // Listen to sockets
  listen(eventName:string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  // Emit sockets
  emit(eventName:string, data:any) {
      this.socket.emit(eventName, data);
  }
}
