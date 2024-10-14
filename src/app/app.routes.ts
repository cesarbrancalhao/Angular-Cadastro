import { Routes } from '@angular/router';
import { DashComponent } from './views/dash/dash.component';
import { FormComponent } from './views/form/form.component';

export const routes: Routes = [
    { path: '', component: DashComponent },
    { path: 'add', component: FormComponent },
    { path: 'edit', component: FormComponent }
];
