import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Group, GroupInfo } from 'src/app/models/group.model';
import { Message } from 'src/app/models/message.model';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages:Message[] = [];
  sortedMessages:Message[] = [];
  messagecontent = '';
  room = '';
  group:GroupInfo = {id: '', name: ''};
  msg = new FormControl('');
  username!: string | null;
  userId!: string | any;
  rooms:string[] = [];
  connectedUsers:{username:string,role:string}[] = [];
  groups:GroupInfo[] = [];
  userGroupRole:string | null = null;
  groupUsers:User[] = [];
  url!:string | null;
  selectedImageName!:string;
  userImage!:string;

  constructor(private socketService:SocketService, private authService:AuthService, private groupService:GroupService) { }
  ngOnDestroy(): void {
    this.leaveRoom(this.room,this.group.id);
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUsername();
    this.authService.getUserById(this.userId)
      .subscribe((user:any) => {
        if(user.image) {
          this.userImage = user.image;
        } else {
          this.userImage = '../assets/images/user.png';
        }
      })

      if (this.userId != undefined) {
        if(this.userId.length > 10) {
          this.groupService.getGroupsByUserId(this.userId)
            .subscribe((groups:any) => {
              groups.forEach((group:any) => {
                this.groups.push({id: group._id, name: group.name});
              });
            })
        }
      }
    this.socketService.initSocket();
    this.socketService.listen('infoMessage')
      .subscribe((data: any) => {
        if(data.room === this.room && data.group == this.group.id) {
          this.messages.push({username: 'bot', text: data.text, room: data.room, group: data.group});
        }
      })
    this.socketService.listen('output-messages')
      .subscribe((messages: any) => {
        messages.forEach( (message: any) => {
          if(message.room === this.room && message.group == this.group.id) {
            this.authService
              .getUserById(message.creator)
              .subscribe((user:any) => {
                this.messages.push({username: user.username, text: message.text, date: message.date, room: message.room, group: message.group, image: message.image, userImage:user.image});
                this.sortedMessages = this.messages.sort((a:any,b:any) => a.date - b.date);
              });
          }
        });
      })
    this.socketService.emit('joinRoom', {username: this.username, room: this.room, group: this.group.id});
    this.socketService.listen('message')
    .subscribe((data: any) => {
      this.messages.push({username: data.creator, text: data.text, date: data.date, room: data.room, group: data.group, image: data.image, userImage: data.userImage});
    })
    this.socketService.listen('connected-users')
    .subscribe((users: any) => {
      if (users.room === this.room) {
        this.connectedUsers = [];
        users.users.forEach((username:string) => {
          this.authService.getUserByUsername(username)
            .subscribe((user:any) => {
              this.groupService.getUserGroupInfoById(this.group.id,user._id)
                .subscribe((userInfo:any) => {
                  if(userInfo.role != null) {
                    this.connectedUsers.push({username: username, role: userInfo.role});
                  }
                })
            })
        });
      }
    })
  }

  // Make a user leave a room
  leaveRoom(room:string, group:string) {
    this.socketService.emit('leaveRoom', {username: this.username, room: room, group: group});
  }

  // Make a user change his current room
  changeRoom(room:string) {
    if(this.room !== room) {
      this.leaveRoom(this.room, this.group.id);
      this.room = room;
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

  // Make a user change his current group
  changeGroup(groupId:string, groupName:string) {
    if(this.group.id !== groupId) {
      this.group = {id: groupId, name: groupName};
      this.leaveRoom(this.room,this.group.id);
      this.room = '';
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
      this.groupService.getUserGroupInfoById(this.group.id,this.userId)
      .subscribe((user:any) => {
        if (user) {
          this.userGroupRole = user.role;
        }
      })
      this.messages = [];
      this.sortedMessages = [];
    } else {
      this.leaveRoom(this.room,this.group.id);
      this.group = {id: '', name: ''};
      this.rooms = [];
      this.groupUsers = [];
      this.room = '';
      this.messages = [];
      this.sortedMessages = [];
      this.userGroupRole = null;
    }
  }

  // Sends a message to the chat
  sendMessage() {
    if (this.msg.value) {
      this.socketService.emit('message',{username: this.authService.getUsername(), userId: this.authService.getUserId(), text: this.msg.value, room: this.room, group: this.group, image: '../assets/images/' + this.selectedImageName, userImage: this.userImage});
      this.msg.reset();
      this.url = null;
    } else if (this.selectedImageName && !this.msg.value) {
      this.socketService.emit('message',{username: this.authService.getUsername(), userId: this.authService.getUserId(), text: '', room: this.room, group: this.group, image: '../assets/images/' + this.selectedImageName, userImage: this.userImage});
      this.msg.reset();
      this.url = null;
    }
  }

  // Display image when file selected
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
