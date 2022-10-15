import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription;
  username!: string | any;
  user!:User;
  userImage:string = '';
  role:string = '';

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUsername();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.username = this.authService.getUsername();
        this.authService.getUserByUsername(this.username)
          .subscribe((user:any) => {
            if(user.image) {
              this.userImage = user.image;
            }
            this.role = user.role;
        })
      });
    this.authService.getAuthUser()
      .subscribe((user:any) => {
        if(user.image) {
          this.userImage = user.image;
        }
        this.role = user.role;
    })
  }

  // Logout when user logs out
  onLogout() {
    this.authService.logout();
  }

  // Unsubscribe when component is destroyed
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
