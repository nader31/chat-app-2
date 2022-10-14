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
    users.push({userId: this.userId, role:"admin"});
    const group:any = {name: name, users: users, };
    this.http
    .post<{message:string,  postId: string}>('http://localhost:3000/api/group',group)
    .subscribe((responseData) => {
      console.log(responseData);
    });
  }
}
