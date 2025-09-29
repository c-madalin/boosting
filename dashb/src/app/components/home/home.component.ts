import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FilterButtonComponent, FilterOption } from '../../shared/filter-button/filter-button.component';
import { BoostingTableComponent, ItemRow } from '../../shared/boosting-table/boosting-table.component';
import { OverlayComponent } from '../overlay/overlay.component';
import { BoostOfferAlertComponent } from '../boost-offer-alert/boost-offer-alert.component';
import { NotificationsPanelComponent, NotifPanelItem } from '../notifications-panel/notifications-panel.component';

import { BoostOffer } from '../../types/boost-offer.model';

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
    BoostOfferAlertComponent,
    NotificationsPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // mock rows pentru tabel
  private allRows: ItemRow[] = [
    { id:1, name:'Duo Queue — Gold II → Plat IV', game:'Valorant',          status:'Active', views:312, price:'$100',  updated:'2 hours ago' },
    { id:2, name:'Solo — Silver → Gold',          game:'League of Legends', status:'Draft',  views: 88,  price:'$85',   updated:'yesterday' },
    { id:3, name:'Coaching 1h',                   game:'CS2',               status:'Hidden', views:145,  price:'€20/h', updated:'3 days ago' },
  ];
  rows: ItemRow[] = [...this.allRows];

  // ofertele disponibile
  private offersById = new Map<number | string, BoostOffer>([
    [1, { gameName: 'Valorant',           currentRank: 'Gold II',  desiredRank: 'Platinum I', currentRP: '2450', platform: 'PC', notes: 'Prefer evening session. Can start now.', priceUSD: 100, sectionLabel: 'Section 1' }],
    [2, { gameName: 'League of Legends',  currentRank: 'Silver I', desiredRank: 'Gold IV',    currentRP: '0',    platform: 'PC', notes: 'Client wants fast queue times.',           priceUSD: 85,  sectionLabel: 'Section 1' }],
    [3, { gameName: 'CS2',                currentRank: '—',       desiredRank: '—',          currentRP: '—',    platform: 'PC', notes: 'Hourly coaching / plays.',                  priceUSD: 20,  sectionLabel: 'Coaching' }],
  ]);

  // === NOTIFICATIONS dropdown ===
  notifOpen = false;
  openNotif(){ this.notifOpen = true; }
  closeNotif(){ this.notifOpen = false; }
  toggleNotifDropdown(){ this.notifOpen = !this.notifOpen; }

  // lista pentru UI (conține BoostOffer-ul)
  notifItems: NotifPanelItem[] = [
    { id:1, offer:this.offersById.get(1)!, subtitle:'You received a new offer', date:'2025-08-27', time:'09:00' },
    { id:2, offer:this.offersById.get(2)!, subtitle:'You received a new offer', date:'2025-07-14', time:'10:59' },
    { id:3, offer:this.offersById.get(3)!, subtitle:'You received a new offer', date:'2025-07-09', time:'19:00' },
  ];
  trackByNotif = (_: number, n: NotifPanelItem) => n.id;

  // === Panel (VIEW ALL / click pe item) folosește același Overlay ===
  showNotifPanel = false;

  onViewAll(){ this.showNotifPanel = true; this.closeNotif(); }
  onOpenFromDropdown(item: NotifPanelItem | BoostOffer){
    // indiferent dacă vine BoostOffer sau item, deschidem panelul
    this.showNotifPanel = true;
    this.closeNotif();
  }

  onPanelClose(){ this.showNotifPanel = false; }
  onPanelTake(offer: BoostOffer){
    this.showNotifPanel = false;
    this.selectedOffer = offer;
    this.showOffer = true;
  }
  onPanelIgnore(item: NotifPanelItem){
    this.notifItems = this.notifItems.filter(x => x !== item);
  }

  // switch „Get Boosting Offers”
  offersEnabled = true;

  // overlay alert
  showOffer = false;
  selectedOffer: BoostOffer | null = null;

  // filtrare tabel
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

  onSearch(term: string){ this.filters.q = term; this.applyFilters(); }
  onStatusChange(v: string[]){ this.filters.status = v; this.applyFilters(); }
  onDatePresetChange(v: string[]){ this.datePreset = v; this.filters.datePreset = v; this.applyFilters(); }
  onViewClick(){ /* noop */ }

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

  // tabel actions (View dezactivat)
  onRowAction(e: { action:'view'|'edit'|'delete'|'promote'; row: ItemRow }) {
    if (e.action === 'delete') this.rows = this.rows.filter(r => r !== e.row);
  }

  // overlay alert handlers
  closeOffer(){ this.showOffer = false; this.selectedOffer = null; }
  onDecline(){ this.closeOffer(); }
  onCounter(){ /* counter-offer flow */ }
  onAccept(){  this.closeOffer(); }
}
