import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../_services/user-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(private us: UserServiceService) {}

  ngOnInit(): void {
    this.us.getUsers().subscribe((e) => console.log(e));
  }
}
