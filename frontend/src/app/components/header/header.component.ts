import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  user!:any;
  userImage:any = '';
  role:any = '';

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

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
