import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: {username: string, text: string, time:string} | any = [
    // {
    //   username: "nader",
    //   text: "blabla nouveau message",
    //   time: "12H30"
    // },
    // {
    //   username: "bob",
    //   text: "olala encore un message",
    //   time: "12H30"
    // },
    // {
    //   username: "poppy",
    //   text: "eh oui c'est moi!",
    //   time: "12H30"
    // },
    // {
    //   username: "nader",
    //   text: "blabla nouveau message",
    //   time: "12H30"
    // },
    // {
    //   username: "bob",
    //   text: "olala encore un message",
    //   time: "12H30"
    // },
    // {
    //   username: "poppy",
    //   text: "eh oui c'est moi!",
    //   time: "12H30"
    // },
  ];
  messagecontent = '';
  room = 'room1';
  msg = new FormControl('');

  constructor(private socketService:SocketService) { }

  ngOnInit(): void {
    // this.socketService.getMessages()
    //   .subscribe((message) => {
    //     this.messages.push(message);
    //     console.log(message);
    //   });
    this.socketService.initSocket();
    this.socketService.listen('message')
      .subscribe((data: any) => {
        console.log(data);
        this.messages.push({username: 'nader', text: data, time: '12H40'});
      })
    this.socketService.emit('joinRoom', this.room);
  }

  changeRoom(room:string) {
    if(this.room !== room) {
      this.room = room;
      console.log(room);
      this.socketService.emit('joinRoom', room);
      this.messages = [];
    }
  }

  leaveRoom() {

  }

  sendMessage() {
    if (this.msg.value) {
      this.socketService.emit('message',{message: this.msg.value, room: this.room});
      console.log(this.msg.value);
      console.log(this.room);
      this.msg.reset();
    }
    //console.log(form.value.message);
    //this.messages.push({username: 'nader', text: form.value.message, time: '12H40'});
  }

}
