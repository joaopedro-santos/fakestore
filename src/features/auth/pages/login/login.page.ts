import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  template: `
    <section class="login-page">
      <h2>Login</h2>
      <p>Área pública para autenticação futura.</p>
    </section>
  `,
  styles: [
    `
      .login-page {
        padding: 2rem;
        border-radius: var(--radius-lg);
        background: white;
        box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
