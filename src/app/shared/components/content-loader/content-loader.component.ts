import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-content-loader',
  templateUrl: './content-loader.component.html'
})
export class ContentLoaderComponent implements OnChanges {
  @Input() active = false;

  @Input() delay = 500;

  isActive = false;

  ngOnChanges(changes: SimpleChanges): void {
    const { active } = changes;

    if (active) {
      if (active.currentValue) {
        setTimeout(() => {
          if (this.active) {
            this.isActive = true;
          }
        }, this.delay);
      } else {
        setTimeout(() => {
          this.isActive = false;
        }, 250);
      }
    }
  }
}
