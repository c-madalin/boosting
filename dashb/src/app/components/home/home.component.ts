import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FilterButtonComponent, FilterOption } from '../../shared/filter-button/filter-button.component';
import { ItemRow, ItemsTableComponent } from '../../shared/items-table/items-table.component';
import { ItemListingComponent } from "../item-listing/item-listing.component";
import { OverlayComponent } from "../overlay/overlay.component";

interface FiltersState {
  q: string;
  game: string[];
  status: string[];
  rating: string[];   // păstrate pentru UI, nu afectează filtrarea itemelor
  server: string[];   // idem
  discounted: boolean;
  datePreset: string[]; // single-select, păstrat ca array pt. compat
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, FilterButtonComponent, ItemsTableComponent, ItemListingComponent, OverlayComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // --- MOCK DATA (items) ---
  private allRows: ItemRow[] = [
    { id:1, name:'Starter Bundle — 8 Skins', game:'Fortnite',           status:'Active', views:312, price:'€24.99', updated:'2 days ago' },
    { id:2, name:'Gold IV Midlane Main',     game:'League of Legends',  status:'Draft',  views: 88,  price:'€29.00', updated:'1 week ago' },
    { id:3, name:'Heist Ready — 50M Cash',   game:'GTA V (Online)',     status:'Active', views:145,  price:'€39.99', updated:'3 days ago' },
    { id:4, name:'Immortal 1 - Prime Ready', game:'Valorant',           status:'Sold',   views:  0,  price:'€59.99', updated:'1 month ago' },
    { id:5, name:'Retail - HW 466 - M+',     game:'World of Warcraft',  status:'Hidden', views:166,  price:'€79.00', updated:'2 weeks ago' },
  ];
  rows: ItemRow[] = [...this.allRows];

  // --- state filtre ---
  filters: FiltersState = {
    q: '',
    game: [],
    status: [],
    rating: [],
    server: [],
    discounted: false,
    datePreset: []
  };

  // --- opțiuni ---
  gameOptions: FilterOption[] = [
    { value:'Fortnite' }, { value:'League of Legends' }, { value:'GTA V (Online)', label:'GTA V' },
    { value:'Minecraft' }, { value:'Valorant' }, { value:'World of Warcraft' }
  ];
  // IMPORTANT: status-urile pentru items
  statusOptions: FilterOption[] = [
    { value:'Active' }, { value:'Draft' }, { value:'Hidden' }, { value:'Sold' }
  ];
  // păstrate doar pentru UI; nu influențează filtrarea items în acest demo
  ratingOptions: FilterOption[] = [
    { value:'Positive' }, { value:'Neutral' }, { value:'Negative' }, { value:'-' }
  ];
  serverOptions: FilterOption[] = [
    { value:'EU' }, { value:'NA' }, { value:'ASIA' }
  ];
  dateOptions: FilterOption[] = [
    { value:'24h', label:'Last 24 hours' },
    { value:'7d',  label:'Last 7 days'  },
    { value:'30d', label:'Last 30 days' },
    { value:'all', label:'All time'     },
  ];

  // === handlers ===
  onSearch(term: string){ this.filters.q = term; this.applyFilters(); }
  setFilter<K extends keyof FiltersState>(key: K, value: FiltersState[K]){ (this.filters[key] as any) = value; this.applyFilters(); }
  onStatusChange(v: string[]){ this.filters.status = v; this.applyFilters(); }
  onRatingChange(v: string[]){ this.filters.rating = v; this.applyFilters(); } // vizual doar

  datePreset: string[] = [];
  onDatePresetChange(v: string[]){
    this.datePreset = v;
    this.filters.datePreset = v;
    this.applyFilters();
  }

  // === filtrare locală (Name/Game/Status + preset dată simplificat) ===
  private applyFilters(){
    const f = this.filters;
    const q = f.q.trim().toLowerCase();

    let list = [...this.allRows];

    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.game.toLowerCase().includes(q)
      );
    }
    if (f.game.length)   list = list.filter(r => f.game.includes(r.game));
    if (f.status.length) list = list.filter(r => f.status && f.status.length ? f.status.includes(r.status) : true);

    // preset dată (demo pe string-ul `updated`)
    if (f.datePreset[0] && f.datePreset[0] !== 'all') {
      list = list.filter(r => r.updated.includes('day') || r.updated.includes('week'));
    }

    this.rows = list;
  }

  // === actions ===
  onSelectionChange(_rows: ItemRow[]) {
    // select multiple callback
  }
  onRowAction(e: { action: string; row: ItemRow }) {
    console.log('Row action:', e.action, e.row);
  }

  // overlays – stubs
  showNewListing = false;
  showNewCurrencyOffer = false;
  openNewListing(){ this.showNewListing = true; }
  closeNewListing(){ this.showNewListing = false; }
  openNewCurrencyOffer(){ this.showNewCurrencyOffer = true; }
  closeNewCurrencyOffer(){ this.showNewCurrencyOffer = false; }

  // pentru (viewClick) din <app-search-bar>
  onViewClick() {
    console.log('view clicked');
  }
  onListingSubmitted(data: any) {
  console.log('New item listing created:', data);

  // aici poți face:
  // - salvare în backend
  // - adăugare la lista locală
  this.rows = [
    ...this.rows,
    {
      id: this.rows.length + 1,
      name: data.title,
      game: data.category,
      status: 'Draft',
      views: 0,
      price: `€${data.price}`,
      updated: 'just now'
    }
  ];

  this.closeNewListing(); // ascundem formularul
}
 get categories(): string[] {
    return this.gameOptions.map(o => o.value);
  }
}
