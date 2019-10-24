import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent }  from './app.component';
import {TodoListComponent} from "./todo/todo-list/todo-list.component";
import {AppRoutingModule} from "./app-routing.module";
import {TodoDetailComponent} from "./todo/todo-detail/todo-detail.component";
import {TodoService} from "./services/todo.service";
import {MessageService} from "./services/message.service";
import {HttpClientModule} from "@angular/common/http";
import {FilterPipe} from "./filters/filter.pipe";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		NgxPaginationModule
	],
	declarations: [
		AppComponent,
		TodoListComponent,
		TodoDetailComponent,
		FilterPipe
	],
	entryComponents: [AppComponent],
	bootstrap: [], // Do not bootstrap anything (see ngDoBootstrap() below)
	providers: [
		TodoService,
		MessageService,
		{ provide: APP_BASE_HREF, useValue : "/" }
	]
})
export class AppModule {

	// Avoid bootstraping any component statically because we need to attach to
	// the portlet's DOM, which is different for each portlet instance and,
	// thus, cannot be determined until the page is rendered (during runtime).

	ngDoBootstrap() {}
}
