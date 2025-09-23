import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FilterButtonComponent, FilterOption } from '../../shared/filter-button/filter-button.component';
import { BoostingTableComponent, BoostRow, BoostType } from '../boosting-table/boosting-table.component';

interface FiltersState {
  q: string;
  type: BoostType[];       // singurul filtru cerut
  datePreset: string[];    // pentru mini-dashboard perioada (stub)
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, FilterButtonComponent, BoostingTableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // --- MOCK DATA (boosting orders) ---
  private allRows: BoostRow[] = [
    { id: 101, name:'Duo Queue — Gold II → Plat IV', game:'Valorant', type:'order in progress',   date:'2 hours ago' },
    { id: 102, name:'Solo — Silver → Gold',          game:'League of Legends', type:'waiting for payment', date:'yesterday' },
    { id: 103, name:'Coaching 1h',                   game:'CS2',     type:'order completed',     date:'2025-09-20 14:32' },
    { id: 104, name:'Duo Queue — Bronze → Silver',   game:'Apex',    type:'order canceled',      date:'2025-09-18' },
    { id: 105, name:'Placement 5 matches',           game:'Valorant',type:'order in progress',   date:'3 days ago' },
  ];
  rows: BoostRow[] = [...this.allRows];

  // --- state filtre ---
  filters: FiltersState = {
    q: '',
    type: [],
    datePreset: []
  };

  // opțiuni filtru Status (un singur buton)
  typeOptions: FilterOption[] = [
    { value:'order in progress', label:'In progress' },
    { value:'order completed',   label:'Completed' },
    { value:'order canceled',    label:'Canceled' },
    { value:'waiting for payment', label:'Waiting payment' },
  ];

  // preset perioadă (mini-dashboard – rămâne stub pentru moment)
  dateOptions: FilterOption[] = [
    { value:'7d',  label:'Last 7 days'  },
    { value:'30d', label:'Last 30 days' },
    { value:'all', label:'All time'     },
  ];
  datePreset: string[] = [];

  // notificări / oferte
  notificationsOn = false;
  getOffersOn = true;

  // === handlers ===
  onSearch(term: string){ this.filters.q = term; this.applyFilters(); }
  onTypeChange(v: string[]){ this.filters.type = v as BoostType[]; this.applyFilters(); }
  onDatePresetChange(v: string[]){ this.datePreset = v; this.filters.datePreset = v; this.applyFilters(); }

  private applyFilters(){
    const f = this.filters;
    const q = f.q.trim().toLowerCase();

    let list = [...this.allRows];

    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.game.toLowerCase().includes(q) ||
        String(r.id).includes(q)
      );
    }
    if (f.type.length) list = list.filter(r => f.type.includes(r.type));

    // demo pentru preset perioadă (poți conecta la date reale ulterior)
    if (f.datePreset[0] && f.datePreset[0] !== 'all') {
      list = list.filter(r => r.date.includes('day') || r.date.includes('hour') || r.date.includes('yesterday'));
    }

    this.rows = list;
  }

  // tabel actions
  onSelectionChange(_rows: BoostRow[]) {}
  onRowAction(e: { action: string; row: BoostRow }) {
    console.log('Row action:', e.action, e.row);
  }

  toggleNotifications(){ this.notificationsOn = !this.notificationsOn; }
  toggleGetOffers(){ this.getOffersOn = !this.getOffersOn; }
}
