// #docplaster
// #docregion
import { Injectable } from '@angular/core';
// #docregion import-httpclient
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
// #enddocregion import-httpclient

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// #docregion import-rxjs-operators
import { catchError, map, tap } from 'rxjs/operators';
// #enddocregion import-rxjs-operators

import {isSuccess} from "@angular/http/src/http_utils";
import "rxjs/add/operator/map";
import {Task} from "../models/task";
import {MessageService} from "./message.service";

// #docregion http-options
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// #enddocregion http-options

@Injectable()
export class TodoService {
    // #docregion heroesUrl
    private TodoApiEndpoint = '/o/todo-rest-service';  // URL to web api
    private getTodoListsEndpoint = '/get-todo-list';
    private getTaskEndpoint = '/get-task';
    private updateTaskEndpoint = '/update-task';
    // private getTasksCityFilter = '/get-Tasks-city-filter';
    // private getTasksContractFilter = '/get-Tasks-contract-filter';
    // private getTasksShiftFilter = '/get-Tasks-shift-filter';
    // private addOrRemoveTaskFromFavoriteEndpoint = '/addOrRemoveTaskFromFavorite/user/';
    // private heroesUrl = 'api/Tasks';  // URL to web api
    // #enddocregion heroesUrl

    // #docregion ctor
    constructor(private http: HttpClient, private messageService: MessageService) { }
    // #enddocregion ctor

    // #docregion getTasks, getTasks-1
    /** GET Tasks from the server */
    // #docregion getTasks-2
    getTodoList (): Observable<Task[]> {
        return this.http.get<Task[]>(this.TodoApiEndpoint + this.getTodoListsEndpoint)
        // #enddocregion getTasks-1
            .pipe(
                // #enddocregion getTasks-2
                tap(heroes => this.log(`fetched todo list`)),
                // #docregion getTasks-2
                catchError(this.handleError('getTodoList', []))
            );
        // #docregion getTasks-1
    }

    // #docregion getHeroNo404
    /** GET Task by id. Return `undefined` when id not found */
    // getHeroNo404<Data>(id: number): Observable<Task> {
    //     const url = `${this.heroesUrl}/?id=${id}`;
    //     return this.http.get<Task[]>(url)
    //         .pipe(
    //             map(heroes => heroes[0]), // returns a {0|1} element array
    //             // #enddocregion getHeroNo404
    //             tap(h => {
    //                 const outcome = h ? `fetched` : `did not find`;
    //                 this.log(`${outcome} hero id=${id}`);
    //             }),
    //             catchError(this.handleError<Task>(`getHero id=${id}`))
    //             // #docregion getHeroNo404
    //         );
    // }
    // #enddocregion getHeroNo404

    // #docregion getTask
    /** GET Task by id. Will 404 if id not found */
    getTask(id: string): Observable<Task> {
        const url = `${this.TodoApiEndpoint + this.getTaskEndpoint}/${id}`;
        return this.http.get<Task>(url).pipe(
            tap(_ => this.log(`fetched task id=${id}`)),
            catchError(this.handleError<Task>(`getTask id=${id}`))
        );
    }

    updateTask(task: Task) {
        const body = new HttpParams()
            .set('id', String(task.id))
            .set('description', task.description)
            .set('status', task.status);
        const url = `${this.TodoApiEndpoint + this.updateTaskEndpoint}`;
        return this.http.post(url, body.toString(),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        );
    }
    // #enddocregion getTask

    // getTasksPositionFilters (): Observable<TaskFilter[]> {
    //     return this.http.get<TaskFilter[]>(this.TaskApiEndpoint + this.getTasksPositionFilter)
    //     // #enddocregion getTasks-1
    //         .pipe(
    //             // #enddocregion getTasks-2
    //             tap(TaskPositionFilters => this.log(`fetched TaskFilters`)),
    //             // #docregion getTasks-2
    //             catchError(this.handleError('getTasksPositionFilters', []))
    //         );
    //     // #docregion getTasks-1
    // }
    //
    // getTasksCityFilters (): Observable<TaskFilter[]> {
    //     return this.http.get<TaskFilter[]>(this.TaskApiEndpoint + this.getTasksCityFilter)
    //     // #enddocregion getTasks-1
    //         .pipe(
    //             // #enddocregion getTasks-2
    //             tap(TasksCityFilters => this.log(`fetched TaskFilters`)),
    //             // #docregion getTasks-2
    //             catchError(this.handleError('getTasksCityFilters', []))
    //         );
    //     // #docregion getTasks-1
    // }
    //
    // getTasksContractFilters (): Observable<TaskFilter[]> {
    //     return this.http.get<TaskFilter[]>(this.TaskApiEndpoint + this.getTasksContractFilter)
    //     // #enddocregion getTasks-1
    //         .pipe(
    //             // #enddocregion getTasks-2
    //             tap(TaskContractFilters => this.log(`fetched TaskFilters`)),
    //             // #docregion getTasks-2
    //             catchError(this.handleError('getTasksContractFilters', []))
    //         );
    //     // #docregion getTasks-1
    // }
    //
    // getTasksShiftFilters (): Observable<TaskFilter[]> {
    //     return this.http.get<TaskFilter[]>(this.TaskApiEndpoint + this.getTasksShiftFilter)
    //     // #enddocregion getTasks-1
    //         .pipe(
    //             // #enddocregion getTasks-2
    //             tap(TaskShiftFilters => this.log(`fetched TaskFilters`)),
    //             // #docregion getTasks-2
    //             catchError(this.handleError('getTasksShiftFilters', []))
    //         );
    //     // #docregion getTasks-1
    // }
    //
    // addOrRemoveTaskFromFavorite (TaskId: String) {
    //     const body = new HttpParams()
    //         .set('userId', window["themeDisplay"].getUserId())
    //         .set('TaskId', TaskId.toString());
    //     const url = `${this.TaskApiEndpoint + this.addOrRemoveTaskFromFavoriteEndpoint}${window["themeDisplay"].getUserId()}/Task/${TaskId}`;
    //     return this.http.post(url, body.toString(),
    //         {
    //             headers: new HttpHeaders()
    //                 .set('Content-Type', 'application/x-www-form-urlencoded')
    //         }
    //     );
    // }

    // #docregion handleError
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better Task of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    // #enddocregion handleError

    // #docregion log
    /** Log a TaskService message with the MessageService */
    private log(message: string) {
        this.messageService.add('TaskService: ' + message);
    }
    // #enddocregion log
}
