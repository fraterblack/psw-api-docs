import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataComponent } from './data.component';

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
    data: {
      title: 'Dados',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
