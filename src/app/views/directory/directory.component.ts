import { Component } from '@angular/core';

import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { ViewComponent } from '../../shared/views/extendable/view-component';

@Component({
  selector: 'app-directory',
  templateUrl: 'directory.component.html'
})
export class DirectoryComponent extends ViewComponent {
  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
  ) {
    super();
  }
}
