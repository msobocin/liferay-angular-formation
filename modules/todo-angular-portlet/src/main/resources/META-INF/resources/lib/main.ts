import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { DynamicLoader } from './app/dynamic.loader';
import {TodoListComponent} from "./app/todo/todo-list/todo-list.component";
// import {AppComponent} from "./app/app.component";

export default function(rootId: any) {
	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.then((injector: any) => {

			// Load the bootstrap component dinamically so that we can attach it
			// to the portlet's DOM, which is different for each portlet
			// instance and, thus, cannot be determined until the page is
			// rendered (during runtime).

			// The rootId argument is passed from view.jsp where we can obtain
			// the portlet's namespace by using JSP tags.

			const dynamicLoader = new DynamicLoader(injector);

			// dynamicLoader.loadComponent(TodoListComponent, rootId);
			dynamicLoader.loadComponent(AppComponent, rootId);
		});
}
