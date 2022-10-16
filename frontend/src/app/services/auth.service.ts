import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../components/auth/auth-data.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ROOT_URL = 'http://localhost:3000/api/user/';

  private isAuthenticated = false;
  private token!:string | null;
  private tokenTimer!:NodeJS.Timer;
  private username!: string | null;
  private userId!: string | any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http:HttpClient, private router:Router) { }

  // Gets all users info
  getAllUsers() {
    return this.http.get
      (this.ROOT_URL);
  }

  // Gets the authenticated user's info
  getAuthUser() {
    return this.http.get
      (this.ROOT_URL + this.getUserId());
  }

  // Gets the a user's info by it's id
  getUserById(id:string) {
    return this.http.get
      (this.ROOT_URL + id);
  }

  // Gets the a user's role by it's id
  getUserRoleById(id:string) {
    return this.http.get
      (this.ROOT_URL + id + "/role");
  }

  // Gets the a user's info by it's username
  getUserByUsername(username:string) {
    return this.http.get
    (this.ROOT_URL + "username/" + username);
  }

  // Updates the a user's image
  updateImage(fileName:string) {
    if(fileName) {
      return this.http.put
      (this.ROOT_URL + this.getUserId(), {image: "../assets/images/" + fileName})
      .subscribe((result) => {
      })
    } else {
      return;
    }
  }

  // Gets the token
  getToken() {
    return this.token;
  }

  // Gets authentication status
  getIsAuth() {
    return this.isAuthenticated;
  }

  // Gets auth user's username
  getUsername() {
    return this.username;
  }

  // Gets auth user's id
  getUserId() {
    return this.getAuthData()?.userId;
  }

  // Gets auth observable
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Creates a user
  createUser(username:string, email:string, password:string){
    const authData: {email: string} & AuthData = {username: username, email: email, password: password}
    this.http.post(this.ROOT_URL + "signup", authData)
      .subscribe(response => {
      });
      this.router.navigate(['/']);
  }

  // Logs the user into the app
  login(username:string, password: string) {
    const authData: AuthData = {username: username, password: password}
    this.http.post<{token: string, expiresIn: number, username: string, userId: string}>(this.ROOT_URL + "login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.username = response.username;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token,expirationDate, this.username, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  // Automatically logs a user
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation!.token;
      this.isAuthenticated = true;
      this.username = authInformation.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  // Logs out the user from the app
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.username = null;
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  // Set the timer of the token
  private setAuthTimer(duration:number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Saves auth data into local storage
  private saveAuthData(token: string, expirationDate: Date, username:string, userId:string) {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
  }

  // Clear auth data from local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  }

  // Get auth data into local storage
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username,
      userId: userId
    }
  }
}
