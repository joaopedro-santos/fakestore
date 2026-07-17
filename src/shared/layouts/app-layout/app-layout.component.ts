import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet],
  template: `
    <div class="app-layout">
      <header class="app-layout__header">
        <div class="container app-layout__header-content">
          <h1>Fake Store</h1>
        </div>
      </header>

      <main class="app-layout__main">
        <div class="container">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .app-layout {
        min-height: 100vh;
        background: var(--color-surface);
      }

      .app-layout__header {
        border-bottom: 1px solid var(--color-border);
        background: white;
      }

      .app-layout__header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 64px;
      }

      .app-layout__main {
        padding: 1.5rem 0 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {}
