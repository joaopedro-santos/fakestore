import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <main class="auth-layout">
      <section class="auth-layout__content">
        <router-outlet />
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .auth-layout {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: var(--color-surface);
      }

      .auth-layout__content {
        width: 100%;
        max-width: 480px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
