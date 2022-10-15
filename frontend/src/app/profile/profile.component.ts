import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  username!:string | null;
  user:any = '';
  image!:string
  selectedImageName!:string;
  url:any;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.authService.getUserByUsername(this.username)
      .subscribe((user:any) => {
        this.user = user;
        console.log(user);
        if(user.image) {
          this.image = user.image
        } else {
          this.image = '../assets/images/user.png'
        }
      })
    }
  }

  onSelectFile(e:any) {
    if(e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
      this.selectedImageName = e.target.files[0].name;
    }
  }

  onSave() {
    this.authService.updateImage(this.selectedImageName);
  }

}
