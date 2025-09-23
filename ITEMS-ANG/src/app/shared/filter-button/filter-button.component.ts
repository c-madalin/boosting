import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label?: string;
  count?: number;
}

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent {
  @Input() label = '+ Filter';
  @Input() options: FilterOption[] = [];
  @Input() multiple = true;

  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  q = '';
  open = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  get selectedCount(){ return this.selected.length; }
  toggleOpen(){ this.open = !this.open; }
  close(){ this.open = false; }

  filteredOptions(): FilterOption[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.options;
    return this.options.filter(o => (o.label ?? o.value).toLowerCase().includes(t));
  }

  isSelected(v: string){ return this.selected.includes(v); }

  onOptionToggle(v: string){
    if (this.multiple){
      const next = this.isSelected(v) ? this.selected.filter(x => x!==v) : [...this.selected, v];
      this.selected = next; this.selectedChange.emit(next);
    } else {
      const next = this.isSelected(v) ? [] : [v];
      this.selected = next; this.selectedChange.emit(next); this.close();
    }
  }

  clear(e?: Event){
    e?.stopPropagation();
    this.selected = [];
    this.selectedChange.emit([]);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent){
    if (!this.open) return;
    const el = this.host.nativeElement;
    if (ev.target instanceof Node && !el.contains(ev.target)) this.close();
  }
}
