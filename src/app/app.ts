import { Component } from '@angular/core';
import { BackgroundComponent } from './components/background/background';
import { LoginFormComponent } from './components/login-form/login-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BackgroundComponent, LoginFormComponent],
  template: `
    <app-background></app-background>
    <div class="overlay">
      <app-login-form></app-login-form>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    app-login-form {
      pointer-events: all;
    }
  `]
})
export class AppComponent {}