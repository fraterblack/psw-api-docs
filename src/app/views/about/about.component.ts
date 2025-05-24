import { Component } from '@angular/core';

import { AlertService } from '../../core/services/alert.service';
import { DialogService } from '../../core/services/dialog.service';
import { AppComponent } from '../../shared/views/extendable/app-component';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent extends AppComponent {
  constructor(
    protected alertService: AlertService,
    protected dialogService: DialogService,
  ) {
    super();
  }
}
