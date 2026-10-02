import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RepPDataComponent } from './rep-p-data.component';

const routes: Routes = [
  {
    path: '',
    component: RepPDataComponent,
    data: {
      title: 'Exportar dados REP-P',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepPDataRoutingModule { }
