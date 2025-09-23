import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() value = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewClick = new EventEmitter<void>();

  private inputEl?: HTMLInputElement;

  emitChange(v: string){ this.searchChange.emit(v); }

  // prindem referința input-ului după render
  ngAfterViewInit(){
    this.inputEl = (document.querySelector('app-search-bar .input-wrap input') as HTMLInputElement) ?? undefined;
  }

  // shortcut: apăsând "/" focusează input-ul
  @HostListener('document:keydown', ['$event'])
  onDocKey(e: KeyboardEvent){
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      const editable = (document.activeElement as HTMLElement | null)?.isContentEditable;
      // nu fura focusul dacă scrii deja într-un câmp
      if (!['input','textarea','select'].includes(tag) && !editable) {
        e.preventDefault();
        this.inputEl?.focus();
      }
    }
  }
}
