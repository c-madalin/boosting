import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostOffer } from '../types/boost-offer.model';

@Component({
  selector: 'app-boost-offer-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boost-offer-alert.component.html',
  styleUrls: ['./boost-offer-alert.component.scss'],
})
export class BoostOfferAlertComponent {
  @Input({ required: true }) offer!: BoostOffer;

  @Output() decline = new EventEmitter<void>();
  @Output() counter = new EventEmitter<void>();
  @Output() accept  = new EventEmitter<void>();
}
