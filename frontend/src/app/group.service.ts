import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  userId:any = this.authService.getUserId();

  constructor(private http:HttpClient, private router:Router, private authService:AuthService) { }

  getGroups() {
    return this.http.get
      ("http://localhost:3000/api/group/");
  }

  getGroupById(id:string) {
    return this.http.get
      ("http://localhost:3000/api/group/" + id);
  }

  getUserGroupInfoById(id:string, userId:string) {
    return this.http.get
      ("http://localhost:3000/api/group/" + id + "/user/" + userId);
  }

  getGroupsByUserId(id:string) {
    return this.http.get
      ("http://localhost:3000/api/group/user/" + id);
  }

  createGroup(name:any, users:any[]) {
    let group:any = {name: name, users: users, rooms: [{name: "general"}]};
    this.http
    .post<{message:string,  postId: string}>('http://localhost:3000/api/group',group)
    .subscribe((response) => {
      console.log(response);
    });
  }

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
