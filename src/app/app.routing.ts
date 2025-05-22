import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultContainerComponent } from './containers/default-container/default-container.component';
import { ViewRoute } from './core/enums/view-route.enum';
import { NotFoundComponent } from './views/error/not-found.component';

// Import Containers
export const routes: Routes = [
  {
    path: '',
    redirectTo: `${ViewRoute.ABOUT}`,
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultContainerComponent,
    children: [
      {
        path: `${ViewRoute.ABOUT}`,
        loadChildren: () => import('./views/about/about.module').then(m => m.AboutModule)
      },
      {
        path: `${ViewRoute.DIRECTORY}`,
        loadChildren: () => import('./views/directory/directory.module').then(m => m.DirectoryModule)
      },
      {
        path: `${ViewRoute.REPORTS}`,
        loadChildren: () => import('./views/report/report.module').then(m => m.ReportModule)
      },
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
