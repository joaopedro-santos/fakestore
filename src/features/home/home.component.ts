import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <main class="home-shell">
      <section class="hero">
        <p class="eyebrow">Angular + Fake Store</p>
        <h1>Base de projeto pronta para escalar</h1>
        <p class="description">
          Estrutura standalone, SCSS, Material, lazy loading e arquitetura por features configurados.
        </p>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .home-shell {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      }

      .hero {
        max-width: 720px;
        width: 100%;
        padding: 2rem;
        border-radius: 1rem;
        background: white;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
      }

      .eyebrow {
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #2563eb;
      }

      h1 {
        margin: 0.5rem 0 1rem;
        font-size: clamp(1.75rem, 4vw, 2.75rem);
      }

      .description {
        margin: 0;
        color: #475569;
        font-size: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly title = signal('home');
}
