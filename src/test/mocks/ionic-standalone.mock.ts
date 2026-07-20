import { Component, EnvironmentProviders, Input, makeEnvironmentProviders } from '@angular/core';

@Component({
  selector: 'ion-app',
  standalone: true,
  template: '<ng-content />',
})
export class IonApp {}

@Component({
  selector: 'ion-router-outlet',
  standalone: true,
  template: '<ng-content />',
})
export class IonRouterOutlet {}

@Component({
  selector: 'ion-content',
  standalone: true,
  template: '<ng-content />',
})
export class IonContent {
  @Input() fullscreen = false;
}

@Component({
  selector: 'ion-menu',
  standalone: true,
  template: '<ng-content />',
})
export class IonMenu {
  @Input() menuId = '';
  @Input() contentId = '';
  @Input() side: 'start' | 'end' = 'start';
  @Input() type = 'overlay';
}

@Component({
  selector: 'ion-list',
  standalone: true,
  template: '<ng-content />',
})
export class IonList {
  @Input() lines: 'none' | 'full' | 'inset' = 'full';
}

@Component({
  selector: 'ion-item',
  standalone: true,
  template: '<ng-content />',
})
export class IonItem {
  @Input() button = false;
  @Input() detail = true;
}

@Component({
  selector: 'ion-label',
  standalone: true,
  template: '<ng-content />',
})
export class IonLabel {}

@Component({
  selector: 'ion-menu-toggle',
  standalone: true,
  template: '<ng-content />',
})
export class IonMenuToggle {
  @Input() autoHide = true;
}

export function provideIonicAngular(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}
