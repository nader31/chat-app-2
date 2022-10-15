import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: {username: string, text: string, date:Date | null} | any = [];
  sortedMessages: {username: string, text: string, date:Date | null} | any = [];
  messagecontent = '';
  room = '';
  group:{id:string, name:string} = {id: '', name: ''};
  msg = new FormControl('');
  username!: string | null;
  userId!: string | any;
  rooms:string[] = [];
  connectedUsers:{username:string,role:string}[] = [];
  groups:{id: string, name: string}[] = [];
  userGroupRole:string | null = null;
  groupUsers:{username:string, groupRole:string, role:string, id:string, image:string}[] = [];
  url!:string | null;
  selectedImageName!:string;

  constructor(private socketService:SocketService, private authService:AuthService, private groupService:GroupService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.username = this.authService.getUsername();
    if(this.userId.length > 10) {
      this.groupService.getGroupsByUserId(this.userId)
        .subscribe((groups:any) => {
          groups.forEach((group:any) => {
            this.groups.push({id: group._id, name: group.name});
          });
        })
    }
    this.socketService.initSocket();
    this.socketService.listen('infoMessage')
      .subscribe((data: any) => {
        console.log(data)
        if(data.room === this.room && data.group == this.group.id) {
          this.messages.push({username: 'bot', text: data.text, room: data.room, group: data.group});
        }
      })
    this.socketService.listen('output-messages')
      .subscribe((messages: any) => {
        console.log(messages);
        messages.forEach( (message: any) => {
          if(message.room === this.room && message.group == this.group.id) {
            this.authService
              .getUserById(message.creator)
              .subscribe((user:any) => {
                this.messages.push({username: user.username, text: message.text, date: message.date, room: message.room, group: message.group, image: message.image});
                this.sortedMessages = this.messages.sort((a:any,b:any) => a.date - b.date);
              });
          }
        });
      })
    this.socketService.emit('joinRoom', {username: this.username, room: this.room, group: this.group.id});
    this.socketService.listen('message')
    .subscribe((data: any) => {
      console.log(data);
      this.messages.push({username: data.creator, text: data.text, date: data.date, room: data.room, group: data.group, image: data.image});
    })
    console.log('userId: ' + this.userId);
    this.socketService.listen('connected-users')
    .subscribe((users: any) => {
      if (users.room === this.room) {
        this.connectedUsers = [];
        users.users.forEach((username:string) => {
          this.authService.getUserByUsername(username)
            .subscribe((user:any) => {
              this.groupService.getUserGroupInfoById(this.group.id,user._id)
                .subscribe((userInfo:any) => {
                  this.connectedUsers.push({username: username, role: userInfo.role});
                })
            })
        });
        console.log('connected users: ', users);
      }
    })
  }

  leaveRoom(room:string, group:string) {
    this.socketService.emit('leaveRoom', {username: this.username, room: room, group: group});
  }

  changeRoom(room:string) {
    if(this.room !== room) {
      this.leaveRoom(this.room, this.group.id);
      this.room = room;
      console.log(room);
      this.socketService.emit('joinRoom', {username: this.username, room: room, group: this.group.id});
      this.messages = [];
      this.sortedMessages = [];
    } else {
      this.leaveRoom(this.room, this.group.id);
      this.room = '';
      this.messages = [];
      this.sortedMessages = [];
    }
  }

  changeGroup(groupId:string, groupName:string) {
    if(this.group.id !== groupId) {
      this.group = {id: groupId, name: groupName};
      this.leaveRoom(this.room,this.group.id);
      this.rooms = [];
      this.groupUsers = [];
      this.groupService.getGroupById(this.group.id)
      .subscribe((group:any) => {
        group.rooms.forEach((room:any) => {
          this.rooms.push(room.name);
        });
        group.users.forEach((user:any) => {
            this.authService.getUserById(user.userId)
              .subscribe((userFetched:any) => {
                let image:any;
                if (userFetched.image) {
                  image = userFetched.image;
                } else {
                  image = '../assets/images/user.png';
                }
                this.groupUsers.push({username:userFetched.username, groupRole: user.role, id: user._id, role: userFetched.role, image: image});
              })
        })
      })
      console.log('groupUsers: ',this.groupUsers);
      this.groupService.getUserGroupInfoById(this.group.id,this.userId)
      .subscribe((user:any) => {
        if (user) {
          this.userGroupRole = user.role;
        }
      })
      this.messages = [];
      this.sortedMessages = [];
      console.log(this.group);
    } else {
      this.leaveRoom(this.room,this.group.id);
      this.group = {id: '', name: ''};
      this.rooms = [];
      this.groupUsers = [];
      this.room = '';
      console.log(this.group);
      this.messages = [];
      this.sortedMessages = [];
      this.userGroupRole = null;
    }
  }

  sendMessage() {
    if (this.msg.value) {
      this.socketService.emit('message',{username: this.authService.getUsername(), userId: this.authService.getUserId(), text: this.msg.value, room: this.room, group: this.group, image: '../assets/images/' + this.selectedImageName});
      console.log(this.authService.getUsername());
      console.log(this.msg.value);
      console.log(this.room);
      console.log('../assets/images/' + this.selectedImageName);
      this.msg.reset();
      this.url = null;
    }
  }

  onSelectFile(e:any) {
    if(e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
      this.selectedImageName = e.target.files[0].name;
    }
  }

}
