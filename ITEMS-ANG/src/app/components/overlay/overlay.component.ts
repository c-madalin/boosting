// overlay.component.ts
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" (click)="close.emit()" role="dialog" aria-modal="true">
  <div class="overlay__content" (click)="$event.stopPropagation()">
    <button class="overlay__close" type="button" aria-label="Close" (click)="close.emit()">✕</button>
    <ng-content></ng-content>
  </div>
</div>

  `,
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent {
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape') this.close.emit();
  }
}
