import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BoostType = 'order in progress' | 'order completed' | 'order canceled' | 'waiting for payment';

export interface BoostRow {
  id: number | string;
  name: string;      // ex: “Duo Queue — Gold II → Plat IV”
  game: string;      // ex: “Valorant”
  type: BoostType;   // statusul cerut
  date: string;      // ex: '2025-09-20 14:32' sau '2 days ago'
}

type RowAction = 'view' | 'details' | 'cancel';

@Component({
  selector: 'app-boosting-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boosting-table.component.html',
  styleUrls: ['./boosting-table.component.scss']
})
export class BoostingTableComponent {
  @Input() rows: BoostRow[] = [];
  @Input() loading = false;

  @Output() selectionChange = new EventEmitter<BoostRow[]>();
  @Output() rowAction = new EventEmitter<{ action: RowAction; row: BoostRow }>();

  selected = new Set<BoostRow>();
  openMenuFor: BoostRow | null = null;

  get allChecked(){ return this.rows.length>0 && this.selected.size===this.rows.length; }
  get anyChecked(){ return this.selected.size>0 && this.selected.size<this.rows.length; }

  trackById = (_: number, r: BoostRow) => r.id;

  toggleAll(checked: boolean){
    this.selected.clear();
    if (checked) this.rows.forEach(r => this.selected.add(r));
    this.selectionChange.emit([...this.selected]);
  }
  toggleRow(row: BoostRow, checked: boolean){
    checked ? this.selected.add(row) : this.selected.delete(row);
    this.selectionChange.emit([...this.selected]);
  }

  emit(action: RowAction, row: BoostRow){
    this.rowAction.emit({ action, row });
    if (this.openMenuFor === row && action !== 'view') this.openMenuFor = null;
  }

  toggleMenu(row: BoostRow, ev?: MouseEvent){
    ev?.stopPropagation();
    this.openMenuFor = this.openMenuFor === row ? null : row;
  }

  @HostListener('document:click')
  closeMenuOnOutsideClick(){ this.openMenuFor = null; }
}
