import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
	selector: 'app-root',
	template: `
        <router-outlet></router-outlet>
	`,
})
export class AppComponent implements OnInit{
	constructor(private router: Router) {}

	ngOnInit(): void {
		this.router.navigate(['list']);
	}
}
