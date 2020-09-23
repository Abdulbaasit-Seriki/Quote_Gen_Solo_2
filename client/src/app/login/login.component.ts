import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private as: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {}
  login(email: string = 'admin@admin.com', password: string = 'Password123@') {
    this.as
      .login(email, password)
      .then((e) => {
        console.log('e', e);
        this.toastr.success('Login Successful');
      })
      .catch((err) => this.toastr.error(err.message));
  }
}
