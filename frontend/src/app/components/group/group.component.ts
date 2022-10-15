import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  fetchedUsers:any = [];
  userId:any;
  groupId:any;
  group:any = '';
  previousUsers:any[] = [];
  rooms!:{name:string}[];

  dropdownList!:{id:string, username:string}[];
  selectedItems!:{id:string, username:string}[];
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
      console.log('dropdownList',this.dropdownList);
    });

    this.userId = this.authService.getUserId();
    this.groupService.getGroupById(this.groupId)
      .subscribe((group:any) => {
        this.group = group;
        this.rooms = group.rooms;
        let users:any[] = group.users;
        console.log('users: ',group.users);
        let i = 0;
        users.forEach((user:any) => {
            this.authService.getUserById(user.userId)
              .subscribe((fetchedUser:any) => {
                console.log('user_id: ',this.userId);
                console.log('user_id 2:', user.userId);
                if(this.userId != user.userId) {
                  this.previousUsers.push({id: user.userId, username: fetchedUser.username, role: user.role});
                  this.users.push({id: user.userId, username: fetchedUser.username});
                  console.log('previousUsers',this.previousUsers);
                  if(this.previousUsers.length > i-2) {
                    this.selectedItems = this.previousUsers;
                  }
                  console.log('selectedUsers: ',this.selectedItems);

                }
              })
            i++
        });
    })

    //this.selectedItems = [{id: "634741641f6ee18abfa6dc5c", username: "user"}];

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

  onUpdateGroup() {
    let usersIds:any = [];
    let idsToRemove:any = [];
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

    console.log(this.users);
    this.users.forEach(user => {
      this.previousUsers.forEach((previousUser:any) => {
        console.log(this.previousUsers);
        if (previousUser.id == user.id) {
          console.log('2 ids',previousUser.id,user.id)
          usersIds.push({userId: user.id, role: previousUser.role});
          idsToRemove.push(user.id);
        }
      });
    });

    idsToRemove.forEach((id:any) => {
      this.users = this.users.filter(function(value, index, arr){
        return id != value.id;
      });
    });

    this.users.forEach(user => {
      usersIds.push({userId: user.id, role: "member"});
    });

    console.log(this.rooms,usersIds);
    this.groupService.updateGroup(this.groupId,this.group.name,usersIds,this.rooms);
    this.router.navigate(['/']);
  }

  makeUserAdmin(user:any) {
    if(user.role == "member") {
      for(var i=0;i < this.previousUsers.length;i++) {
        if(this.previousUsers[i].id === user.id)
        {
          this.previousUsers[i].role='admin';
        }
      }
      console.log(this.previousUsers);
    } else {
      for(var i=0;i < this.previousUsers.length;i++) {
        if(this.previousUsers[i].id === user.id)
        {
          this.previousUsers[i].role='member';
        }
      }
      console.log(this.previousUsers);
    }
  }

  onItemSelect(item: any) {
    this.users.push(item);
    console.log(this.users);
  }

  onDeSelect(item: any) {
    this.users = this.users.filter(function(value, index, arr){
        return item.id != value.id;
    });
    this.previousUsers.forEach((user:any) => {
      if(item.id == user.id) {
        this.previousUsers = this.previousUsers.filter(function(value: { id: any; }, index: any, arr: any){
          return item.id != value.id;
        })
      }
    });
    console.log(this.users);
  }
}
