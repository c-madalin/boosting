import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() viewClick = new EventEmitter<void>();

  term = '';
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  onKey(term: string) {
    this.term = term;
    this.searchChange.emit(term);
  }

  focusWithSlash(e: KeyboardEvent) {
    if (e.key === '/') {
      e.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  }
}
