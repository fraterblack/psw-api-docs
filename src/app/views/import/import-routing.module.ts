import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImportComponent } from './import.component';

const routes: Routes = [
  {
    path: '',
    component: ImportComponent,
    data: {
      title: 'Importações',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
