import { Component } from '@angular/core';
import { BackgroundComponent } from './components/background/background';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BackgroundComponent],
  template: `<app-background></app-background>`
})
export class AppComponent {}