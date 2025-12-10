import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() className: string = '';

  getCardClasses(): string {
    const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getHeaderClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() className: string = '';

  getHeaderClasses(): string {
    const baseClasses = 'flex flex-col space-y-1.5 p-6';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getTitleClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardTitleComponent {
  @Input() className: string = '';

  getTitleClasses(): string {
    const baseClasses = 'text-2xl font-semibold leading-none tracking-tight';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getDescriptionClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardDescriptionComponent {
  @Input() className: string = '';

  getDescriptionClasses(): string {
    const baseClasses = 'text-sm text-muted-foreground';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContentClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() className: string = '';

  getContentClasses(): string {
    const baseClasses = 'p-6 pt-0';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getFooterClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() className: string = '';

  getFooterClasses(): string {
    const baseClasses = 'flex items-center p-6 pt-0';
    return [baseClasses, this.className].filter(Boolean).join(' ');
  }
}