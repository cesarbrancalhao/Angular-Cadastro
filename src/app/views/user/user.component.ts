import { Component } from '@angular/core';
import { User } from '../../models/user/user';
import { UserService } from '../../models/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  users: User[] = [];

  constructor(private us: UserService, private router: Router) {
  }

  edit(user: User) {
    localStorage.setItem('editUserId', user.id.toString());
    this.router.navigate(['/edit']);
  }

  delete(user: User) {
    this.us.delete(user);
  }

  ngOnInit() {
    this.users = this.us.getall();
  }
}
