import {Component, OnInit} from '@angular/core';
import {Task} from "../../models/task";
import {TodoService} from "../../services/todo.service";

@Component({
	moduleId: module.id,
	selector: 'app-todo-list',
	template: `
	<h1>{{title}}</h1>
	
	<div class="row">
		<div class="col-12">
			<label>Search:</label>
			<input id="search" type="search" [(ngModel)]="searchText"
				   placeholder="Search" onfocus="this.placeholder = ''"
				   onblur="this.placeholder = 'Search'"
				   class="form-control">
		</div>

		<div class="col-12">
			<label>Status Filter:</label>
			<select [(ngModel)]="searchFilter">
				<option value="">Filter</option>
				<option value="approved">approved</option>
				<option value="rejected">rejected</option>
				<option value="pending">pending</option>
			</select>
		</div>
	</div>
<!--	<h2>{{hero.name}} details!</h2>-->
	<ul *ngFor="let task of todoList | filter: searchText:searchFilter | paginate: { itemsPerPage: 4, currentPage: currentPage }">
		<li>
			<a routerLink="/detail/{{ task.id }}">
				{{ task.description }} - {{ task.status }}
			</a>
		</li>
	</ul>
	
	<pagination-controls (pageChange)="currentPage = $event"></pagination-controls>
	`,
})
export class TodoListComponent implements OnInit {
	todoList: Task[];
	title = 'Todo List';
	searchText: string;
	searchFilter: string;

	currentPage: number = 1;

	constructor(
		private todoService: TodoService
	) {}

	ngOnInit() {
		this.getTodoList();
	}

	getTodoList(): void {
		this.todoService.getTodoList()
			.subscribe(todoList => {this.todoList = todoList;});
	}

}
