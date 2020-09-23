import { Component, OnInit } from '@angular/core';
import { trainersData } from '../_data/trainers';
import { AuthService } from '../_services/auth.service';
import { UserServiceService } from '../_services/user-service.service';
import { usersData } from '../_data/users';
import { Trainer, UserClass } from '../_model/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.signup();
  }
  signup() {
    this.authService
      .register('tim@example.com', 'Password123@', usersData[0])
      .then((res) => {
        console.log('res', res);
        this.toastr.success('Register Successful');
      })
      .catch((err) => this.toastr.error(err.message));
  }
  delete() {
    this.authService
      .remove()
      .then((res) => {
        console.log('res', res);
        this.toastr.success('Delete Successful');
      })
      .catch((err) => {
        console.log('err', err);
        this.toastr.error(err.message);
      });
  }
}
