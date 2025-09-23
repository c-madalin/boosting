import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FilterButtonComponent, FilterOption } from '../../shared/filter-button/filter-button.component';
import { BoostingTableComponent, ItemRow } from '../../shared/boosting-table/boosting-table.component';
import { OverlayComponent } from '../overlay/overlay.component';
import { BoostOfferAlertComponent } from '../boost-offer-alert/boost-offer-alert.component';

import { BoostOffer } from '../../types/boost-offer.model';

// ... importurile rămân aceleași

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    FilterButtonComponent,
    BoostingTableComponent,
    OverlayComponent,
    BoostOfferAlertComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // mock rows pentru tabel
  private allRows: ItemRow[] = [
    { id:1, name:'Duo Queue — Gold II → Plat IV', game:'Valorant', status:'Active', views:312, price:'$100',  updated:'2 hours ago' },
    { id:2, name:'Solo — Silver → Gold',          game:'League of Legends', status:'Draft',  views: 88,  price:'$85',   updated:'yesterday' },
    { id:3, name:'Coaching 1h',                   game:'CS2',               status:'Hidden', views:145,  price:'€20/h', updated:'3 days ago' },
  ];
  rows: ItemRow[] = [...this.allRows];

  // ofertele disponibile
  private offersById = new Map<number | string, BoostOffer>([
    [1, { gameName: 'Valorant', currentRank: 'Gold II', desiredRank: 'Platinum I', currentRP: '2450', platform: 'PC', notes: 'Prefer evening session. Can start now.', priceUSD: 100, sectionLabel: 'Section 1' }],
    [2, { gameName: 'League of Legends', currentRank: 'Silver I', desiredRank: 'Gold IV', currentRP: '0', platform: 'PC', notes: 'Client wants fast queue times.', priceUSD: 85, sectionLabel: 'Section 1' }],
    [3, { gameName: 'CS2', currentRank: '—', desiredRank: '—', currentRP: '—', platform: 'PC', notes: 'Hourly coaching / plays.', priceUSD: 20, sectionLabel: 'Coaching' }],
  ]);

  // dropdown notificări
  notifOpen = false;
  notifications: BoostOffer[] = [...this.offersById.values()];

  // state filtre
  filters = { q: '', status: [] as string[], datePreset: [] as string[] };
  statusOptions: FilterOption[] = [
    { value:'Active' }, { value:'Draft' }, { value:'Hidden' }, { value:'Sold' }
  ];
  dateOptions: FilterOption[] = [
    { value:'24h', label:'Last 24 hours' },
    { value:'7d',  label:'Last 7 days'  },
    { value:'30d', label:'Last 30 days' },
    { value:'all', label:'All time'     },
  ];
  datePreset: string[] = [];

  offersEnabled = true;

  // overlay state
  showOffer = false;
  selectedOffer: BoostOffer | null = null;

  // --- dropdown handlers
  toggleNotifDropdown() {
    this.notifOpen = !this.notifOpen;
  }

  openFromNotif(offer: BoostOffer) {
    this.selectedOffer = offer;
    this.showOffer = true;
    this.notifOpen = false;
  }

  // --- filtrare
  onSearch(term: string){ this.filters.q = term; this.applyFilters(); }
  onStatusChange(v: string[]){ this.filters.status = v; this.applyFilters(); }
  onDatePresetChange(v: string[]){ this.datePreset = v; this.filters.datePreset = v; this.applyFilters(); }
  onViewClick(){ console.log('viewClick triggered'); }

  private applyFilters(){
    const f = this.filters;
    const q = f.q.trim().toLowerCase();
    let list = [...this.allRows];

    if (q) list = list.filter(r => r.name.toLowerCase().includes(q) || r.game.toLowerCase().includes(q));
    if (f.status.length) list = list.filter(r => f.status.includes(r.status));
    if (f.datePreset[0] && f.datePreset[0] !== 'all') {
      list = list.filter(r => r.updated.includes('day') || r.updated.includes('hour'));
    }

    this.rows = list;
  }

  // --- row actions (View dezactivat momentan)
  onRowAction(e: { action:'view'|'edit'|'delete'|'promote'; row: ItemRow }) {
    if (e.action === 'delete') {
      this.rows = this.rows.filter(r => r !== e.row);
    }
  }

  // overlay handlers
  closeOffer(){ this.showOffer = false; this.selectedOffer = null; }
  onDecline(){ if (this.selectedOffer) this.closeOffer(); }
  onCounter(){ console.log('Counter-offer', this.selectedOffer); }
  onAccept(){  console.log('Accepted', this.selectedOffer); this.closeOffer(); }
}
