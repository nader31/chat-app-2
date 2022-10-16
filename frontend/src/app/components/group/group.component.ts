import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupComponent implements OnInit {

  roomsInput = new FormControl('');
  users:any[] = [];
  fetchedUsers:User[] = [];
  userId: string | any;
  groupId:any;
  group:any = '';
  previousUsers:any[] = [];
  rooms!:Room[];

  dropdownList!:any[];
  selectedItems!:any[];
  dropdownSettings!:IDropdownSettings;

  constructor(private groupService:GroupService, private router:Router, private authService:AuthService, private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.groupId = params['id']);
  }

  ngOnInit(): void {
    this.authService.getAllUsers()
      .subscribe((users:any) => {
        let userId = this.userId
        this.dropdownList = users.filter(function(value: { id: any; }, index: any, arr: any){
          return userId != value.id;
      });
    });

    this.userId = this.authService.getUserId();
    this.groupService.getGroupById(this.groupId)
      .subscribe((group:any) => {
        this.group = group;
        this.rooms = group.rooms;
        let users:any[] = group.users;
        let i = 0;
        users.forEach((user:any) => {
            this.authService.getUserById(user.userId)
              .subscribe((fetchedUser:any) => {
                if(this.userId != user.userId) {
                  this.previousUsers.push({id: user.userId, username: fetchedUser.username, role: user.role});
                  this.users.push({id: user.userId, username: fetchedUser.username});
                  if(this.previousUsers.length > i-2) {
                    this.selectedItems = this.previousUsers;
                    console.log('selectedItems init:',this.selectedItems);
                  }
                  console.log('previousUsers init:',this.previousUsers);
                }
              })
            i++
        });
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };
  }

  // Updates the group
  onUpdateGroup() {
    let usersIds:any = [];
    let idsToRemove:any = [];
    console.log('users array',this.users);
    console.log('usersIds init',usersIds);
    console.log('idsToRemove init',idsToRemove);
    if (this.roomsInput.value != null) {
      let roomArray = [];
      roomArray = this.roomsInput.value.split(",");
      roomArray.forEach(room => {
        this.rooms.push({name: room});
      });
    }
    this.rooms = this.rooms.filter(function(value, index, arr){
      return '' != value.name;
    });
    console.log('start of foreach');
    console.log('users before populating usersIds',this.users);
    console.log('======================================');
    let i = 0;
    this.users.forEach(user => {
      console.log('loop users ' + i);
      console.log('user checked: ',user);
      i++;
      let j = 0;
      this.previousUsers.forEach((previousUser:any) => {
        console.log('loop j ' +j)
        j++;
        console.log('Previous user checked: ',previousUser);
        if (previousUser.id == user.id) {
          usersIds.push({userId: user.id, role: previousUser.role});
          idsToRemove.push(user.id);
        }
        console.log('usersIds for these users',usersIds);
        console.log('idsToRemove for these users',idsToRemove);
        console.log('======================================');
      });
    });
    console.log('usersIds after populate',usersIds);
    console.log('idsToRemove after populate',idsToRemove);
    console.log('======================================');
    let k = 0;
    console.log('users before removed ids',this.users);
    console.log('---');
    idsToRemove.forEach((id:any) => {
      console.log('loop k ' + k)
      console.log('id being checked: ',id);
      this.users = this.users.filter(function(value, index, arr){
        return id != value.id;
      });
      console.log('users after this loop ' + (k),this.users);
      k++;
    });
    console.log('---');
    console.log('users after removed ids',this.users);
    console.log('======================================');

    this.users.forEach(user => {
      usersIds.push({userId: user.id, role: "member"});
    });
    console.log('final usersIds: ', usersIds)
    usersIds.push({userId: this.userId, role:"admin"});

    let duplicateIdsToCheck:string[] = [];
    usersIds.forEach((user:any) => {
      duplicateIdsToCheck.push(user.userId);
    });
    console.log('duplicate ids to check: ',duplicateIdsToCheck);

    if (duplicateIdsToCheck.length !== new Set(duplicateIdsToCheck).size) {
      console.log(true);
      console.log('there was an issue');
      this.router.navigate(['/']);
    } else {
      console.log('no issue, group updated');
      this.groupService.updateGroup(this.groupId,this.group.name,usersIds,this.rooms);
      this.router.navigate(['/']);
    }
  }

  // Change the group's role of a user
  makeUserAdmin(user:any) {
    if(user.role == "member") {
      for(var i=0;i < this.previousUsers.length;i++) {
        if(this.previousUsers[i].id === user.id)
        {
          this.previousUsers[i].role='admin';
          console.log('added admin right to ' + this.previousUsers[i].username);
        }
      }
    } else {
      for(var i=0;i < this.previousUsers.length;i++) {
        if(this.previousUsers[i].id === user.id)
        {
          this.previousUsers[i].role='member';
          console.log('removed admin rights from ' + this.previousUsers[i].username);
        }
      }
    }
    console.log('users array after this modification',this.users);
  }

  // When user is selected
  onItemSelect(item: any) {
    this.users.push(item);
    console.log(item);
    console.log(this.users);
  }

  // When user is deselected
  onDeSelect(item: any) {
    this.users = this.users.filter(function(value, index, arr){
        return item.id != value.id;
    });
    console.log('removed from users: ', item.id);
    this.previousUsers.forEach((user:any) => {
      if(item.id == user.id) {
        this.previousUsers = this.previousUsers.filter(function(value, index: any, arr: any){
          return item.id != value.id;
        })
        console.log('removed from previousUsers: ', item.id,user.id);
      }
    });
    console.log('previousUsers array after deselect: ',this.previousUsers);
    console.log('users array after deselect: ', this.users);
  }
}
