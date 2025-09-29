import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostOffer } from '../../types/boost-offer.model';

export type NotifPanelItem = {
  id: number | string;
  offer: BoostOffer;
  subtitle: string;  // ex: "You received a new offer"
  date: string;      // "2025-08-27"
  time: string;      // "09:00"
};

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent {
  @Input({required:true}) items: NotifPanelItem[] = [];
  @Output() take = new EventEmitter<BoostOffer>();
  @Output() ignore = new EventEmitter<NotifPanelItem>();
  @Output() close = new EventEmitter<void>();

  trackById = (_: number, x: NotifPanelItem) => x.id;
}
