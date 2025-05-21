import { Component } from '@angular/core';

import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { ViewComponent } from '../../shared/views/extendable/view-component';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent extends ViewComponent {
  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
  ) {
    super();
  }
}
