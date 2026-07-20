import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle } from '@ionic/angular/standalone';
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
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuController = inject(MenuController);
  private readonly sessionService = inject(SessionService);
  private readonly themeService = inject(ThemeService);

  @ViewChild('mainContent') private mainContent?: IonContent;

  protected readonly activeTheme = this.themeService.theme;
  protected readonly dashboardRoute = `/${ROUTES.DASHBOARD}`;
  protected readonly productsRoute = `/${ROUTES.PRODUCTS.ROOT}`;
  protected readonly createProductRoute = `/${ROUTES.PRODUCTS.ROOT}/${ROUTES.PRODUCTS.CREATE}`;

  protected readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.buildBreadcrumbs(this.router.url)),
  );

  public ngOnInit(): void {
    void this.menuController.enable(true, 'main-mobile-menu');
  }

  public ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.mainContent?.scrollToTop(0);
      });
  }

  protected closeMobileMenu(): void {
    void this.menuController.close('main-mobile-menu');
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
