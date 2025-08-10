import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-loading-overlay',
  imports: [NzSpinModule],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKLoadingOverlay {
  isLoading = input<boolean>(false);
  tip = input<string>('Loading...');
}
