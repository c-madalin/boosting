import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [NgIf],
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent {
  @Input() open = false;
  @Output() backdropClick = new EventEmitter<void>();

  onBackdrop(e: MouseEvent) {
    // clic pe zona întunecată => închidere
    this.backdropClick.emit();
    e.stopPropagation();
  }

  stop(e: MouseEvent) {
    // oprește propagarea când se dă click pe “content”
    e.stopPropagation();
  }
}
