import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.username,form.value.email,form.value.password);
  }

}
