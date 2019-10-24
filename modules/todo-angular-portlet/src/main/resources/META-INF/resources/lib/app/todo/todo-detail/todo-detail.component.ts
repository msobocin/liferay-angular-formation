import {Component, OnInit} from '@angular/core';
import {Task} from "../../models/task";
import {TodoService} from "../../services/todo.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';

@Component({
	moduleId: module.id,
	selector: 'app-task-detail',
	template: `
	<a routerLink="/list">Back to todo list</a>
	<h1>{{title}}</h1>
	<h2>{{task.description}} details!</h2>
	<div><label>id: </label>{{task.id}}</div>
	<div>
		<label>description: </label>
		<input [(ngModel)]="task.description" placeholder="description">
	</div>
	<div>
		<label>status: </label>
		<input [(ngModel)]="task.status" placeholder="status">
	</div>
		
	<button (click)="updateTask()">Update</button>
	`,
})
export class TodoDetailComponent implements OnInit {
	title = 'Todo List';
	task: Task;

	constructor(
		private todoService: TodoService,
		private route: ActivatedRoute,
		private location: Location,
	) {}

	ngOnInit() {
		this.getTask()
	}

	getTask(): void {
		const taskId: any = this.route.snapshot.paramMap.get('id');

		this.todoService.getTask(taskId)
			.subscribe(task => this.task = task);
	}

	updateTask(): void {
		this.todoService.updateTask(this.task)
			.subscribe(data => {
				console.log(data);
				// if (data["success"]) this.job.favorite = !this.job.favorite;
			});
	}
}
