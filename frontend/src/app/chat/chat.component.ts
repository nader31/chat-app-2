import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: {username: string, text: string, date:string} | any = [];
  messagecontent = '';
  room = 'room1';
  msg = new FormControl('');
  username!: string | null;
  userId!: any;
  rooms:string[] = ['room1','room2','room3'];

  constructor(private socketService:SocketService, private authService:AuthService) { }

  ngOnInit(): void {
    this.socketService.initSocket();
    this.socketService.listen('infoMessage')
      .subscribe((data: any) => {
        if(data.room === this.room) {
          this.messages.push({username: 'bot', text: data.text, date: '', room: data.room});
        }
        console.log(data);
      })
    this.socketService.listen('output-messages')
      .subscribe((messages: any) => {
        console.log(messages);
        messages.forEach( (message: any) => {
          if(message.room === this.room) {
            this.messages.push({username: message.creator, text: message.text, date: message.date, room: message.room});
          }
        });
      })
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUsername();
    this.socketService.emit('joinRoom', {username: this.username, room: this.room});
    this.socketService.listen('message')
    .subscribe((data: any) => {
      console.log(data);
      this.messages.push({username: data.creator, text: data.text, date: data.date, room: data.room});
    })
    console.log('userId: ' + this.userId);
  }

  changeRoom(room:string) {
    if(this.room !== room) {
      this.room = room;
      console.log(room);
      this.socketService.emit('joinRoom', {username: this.username, room: room});
      this.messages = [];
    }
  }

  sendMessage() {
    if (this.msg.value) {
      this.socketService.emit('message',{username: this.authService.getUsername(), userId: this.authService.getUserId(), text: this.msg.value, room: this.room});
      console.log(this.authService.getUsername());
      console.log(this.msg.value);
      console.log(this.room);
      this.msg.reset();
    }
  }

}
