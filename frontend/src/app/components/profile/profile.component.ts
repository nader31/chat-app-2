import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  username!:string | null;
  user:User | any = '';
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
        if(user.image) {
          this.image = user.image
        } else {
          this.image = '../assets/images/user.png'
        }
      })
    }
  }

  // Display image when file selected
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

  // Save user's image
  onSave() {
    this.authService.updateImage(this.selectedImageName);
  }

}
