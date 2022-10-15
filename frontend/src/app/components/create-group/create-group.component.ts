import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from '../../services/auth.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateGroupComponent implements OnInit {

  nameInput = new FormControl('');
  users:any[] = [];
  fetchedUsers:any = [];
  userId:any;

  dropdownList!:{item_id:number, item_text:string}[];
  selectedItems!:{item_id:number, item_text:string}[];
  dropdownSettings!:IDropdownSettings;

  constructor(private groupService:GroupService, private router:Router, private authService:AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.authService.getAllUsers()
      .subscribe((users:any) => {
        let userId = this.userId
        this.dropdownList = users.filter(function(value: { id: any; }, index: any, arr: any){
          return userId != value.id;
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

  onCreateGroup() {
    console.log('group created!');
    let usersIds:any = [];
    this.users.forEach(user => {
      usersIds.push({userId: user.id, role: "member"})
    });
    this.groupService.createGroup(this.nameInput.value,usersIds);
    this.router.navigate(['/']);
  }

  onItemSelect(item: any) {
    this.users.push(item);
    console.log(this.users);
  }

  onDeSelect(item: any) {
    this.users = this.users.filter(function(value, index, arr){
        return item.id != value.id;
    });
    console.log(this.users);
  }
}
