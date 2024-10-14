import { Component } from '@angular/core';
import { User } from '../../models/user/user';
import { UserComponent } from "../user/user.component";
import { FormComponent } from '../form/form.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [UserComponent, FormComponent, RouterLink],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export class DashComponent {

}
