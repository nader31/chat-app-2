import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  userId:any = this.authService.getUserId();

  constructor(private http:HttpClient, private router:Router, private authService:AuthService) { }

  // Get all groups info
  getGroups() {
    return this.http.get
      ("http://localhost:3000/api/group/");
  }

  // Get a group's info by it's id
  getGroupById(id:string) {
    return this.http.get
      ("http://localhost:3000/api/group/" + id);
  }

  // Get the infos of a user in a group by it's id and the group's id
  getUserGroupInfoById(id:string, userId:string) {
    return this.http.get
      ("http://localhost:3000/api/group/" + id + "/user/" + userId);
  }

  // Get all the groups a user is a part of
  getGroupsByUserId(id:string) {
    return this.http.get
      ("http://localhost:3000/api/group/user/" + id);
  }

  // Create a group
  createGroup(name:any, users:any[]) {
    let group:any = {name: name, users: users, rooms: [{name: "general"}]};
    this.http
    .post<{message:string,  postId: string}>('http://localhost:3000/api/group',group)
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
      .put("http://localhost:3000/api/group/" + id, group)
      .subscribe(response => {
        console.log(response);
      });
  }
}
