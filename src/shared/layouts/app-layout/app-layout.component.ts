import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { ThemeMode, ThemeService } from '../../../core/services/theme.service';
import { ROUTES } from '../../../core/constants/routes.constants';

interface BreadcrumbItem {
  label: string;
  url: string;
  current: boolean;
}

@Component({
  selector: 'app-app-layout',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly themeService = inject(ThemeService);

  protected readonly menuOpen = signal(false);
  protected readonly activeTheme = this.themeService.theme;
  protected readonly dashboardRoute = `/${ROUTES.DASHBOARD}`;
  protected readonly productsRoute = `/${ROUTES.PRODUCTS.ROOT}`;

  protected readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.buildBreadcrumbs(this.router.url)),
  );

  protected toggleMobileMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.menuOpen.set(false);
  }

  protected setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
  }

  protected logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  private buildBreadcrumbs(url: string): BreadcrumbItem[] {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter((segment) => segment.length > 0);

    if (segments.length === 0 || segments[0] === ROUTES.DASHBOARD) {
      return [{ label: 'Dashboard', url: this.dashboardRoute, current: true }];
    }

    if (segments[0] === ROUTES.PRODUCTS.ROOT) {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', url: this.dashboardRoute, current: false },
        { label: 'Produtos', url: this.productsRoute, current: segments.length === 1 },
      ];

      if (segments.length > 1 && segments[1] === ROUTES.PRODUCTS.CREATE) {
        breadcrumbs[1] = { ...breadcrumbs[1], current: false };
        breadcrumbs.push({ label: 'Novo produto', url: `${this.productsRoute}/${ROUTES.PRODUCTS.CREATE}`, current: true });
      }

      if (segments.includes('edit')) {
        breadcrumbs[1] = { ...breadcrumbs[1], current: false };
        breadcrumbs.push({ label: 'Editar produto', url: cleanUrl, current: true });
      }

      return breadcrumbs;
    }

    return [
      { label: 'Dashboard', url: this.dashboardRoute, current: false },
      { label: 'Página', url: cleanUrl, current: true },
    ];
  }
}
