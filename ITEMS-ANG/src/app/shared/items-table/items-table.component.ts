import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ItemStatus = 'Active' | 'Draft' | 'Hidden' | 'Sold';

export interface ItemRow {
  name: string;
  game: string;
  status: ItemStatus;
  views: number;
  price: string | number;  // ex: '€24.99' sau 24.99
  updated: string;         // ex: '2 days ago' sau ISO
  id?: string | number;
  imageUrl?: string;
}

type RowAction = 'edit' | 'delete' | 'view' | 'promote';

@Component({
  selector: 'app-items-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent {
  @Input() rows: ItemRow[] = [];
  @Input() loading = false;

  @Output() selectionChange = new EventEmitter<ItemRow[]>();
  @Output() rowAction = new EventEmitter<{ action: RowAction; row: ItemRow }>();

  selected = new Set<ItemRow>();
  openMenuFor: ItemRow | null = null;
  imageVisibleFor: ItemRow | null = null;

  get allChecked(){ return this.rows.length>0 && this.selected.size===this.rows.length; }
  get anyChecked(){ return this.selected.size>0 && this.selected.size<this.rows.length; }

  trackById = (_: number, r: ItemRow) => r.id ?? r.name;

  toggleAll(checked: boolean){
    this.selected.clear();
    if (checked) this.rows.forEach(r => this.selected.add(r));
    this.selectionChange.emit([...this.selected]);
  }
  toggleRow(row: ItemRow, checked: boolean){
    checked ? this.selected.add(row) : this.selected.delete(row);
    this.selectionChange.emit([...this.selected]);
  }

  emit(action: RowAction, row: ItemRow){
    this.rowAction.emit({ action, row });
    if (this.openMenuFor === row && action !== 'view') this.openMenuFor = null;
  }

  toggleMenu(row: ItemRow, ev?: MouseEvent){
    ev?.stopPropagation();
    this.openMenuFor = this.openMenuFor === row ? null : row;
  }

  toggleImage(row: ItemRow){
    this.imageVisibleFor = this.imageVisibleFor === row ? null : row;
  }

  @HostListener('document:click')
  closeMenuOnOutsideClick(){ this.openMenuFor = null; }
}
