import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {TodoListComponent} from "./todo/todo-list/todo-list.component";
import {TodoDetailComponent} from "./todo/todo-detail/todo-detail.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: TodoListComponent },
    { path: 'detail/:id', component: TodoDetailComponent },
    // { path: 'detail/:id', component: JobDetailComponent },
    // { path: '', redirectTo: 'jobs', pathMatch: 'full', component: JobsComponent },
    // { path: 'jobs', component: JobsComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(
        routes,
        {
            useHash: true
        }
    ) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
