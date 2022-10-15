import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GroupFetched } from '../models/group.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  ROOT_URL = 'http://localhost:3000/api/group/';

  userId:any = this.authService.getUserId();

  constructor(private http:HttpClient, private router:Router, private authService:AuthService) { }

  // Get all groups info
  getGroups() : GroupFetched[] | any {
    return this.http.get
      (this.ROOT_URL);
  }

  // Get a group's info by it's id
  getGroupById(id:string) {
    return this.http.get
      (this.ROOT_URL + id);
  }

  // Get the infos of a user in a group by it's id and the group's id
  getUserGroupInfoById(id:string, userId:string) {
    return this.http.get
      (this.ROOT_URL + id + "/user/" + userId);
  }

  // Get all the groups a user is a part of
  getGroupsByUserId(id:string) {
    return this.http.get
      (this.ROOT_URL + "user/" + id);
  }

  // Create a group
  createGroup(name:any, users:any[]) {
    let group:any = {name: name, users: users, rooms: [{name: "general"}]};
    this.http
    .post<{message:string,  postId: string}>(this.ROOT_URL,group)
    .subscribe((response) => {
      console.log(response);
    });
  }

  // Update a group
  updateGroup(id:string, name:any, users:any[], rooms:{name:string}[]) {
    users.push({userId: this.userId, role:"admin"});
    let group:{name:string, users:{userId:string,role:string}[],rooms:{name:string}[]} = {name: name, users: users, rooms: rooms};
    console.log(group);
    this.http
      .put(this.ROOT_URL + id, group)
      .subscribe(response => {
        console.log(response);
      });
  }
}
