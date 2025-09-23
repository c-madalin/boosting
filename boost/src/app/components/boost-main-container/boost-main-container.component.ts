import { Component } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay.component';
import { BoostOfferAlertComponent } from '../boost-offer-alert/boost-offer-alert.component';
import { BoostOffer } from '../types/boost-offer.model';

@Component({
  selector: 'app-boost-main-container',
  standalone: true,
  imports: [OverlayComponent, BoostOfferAlertComponent],
  templateUrl: './boost-main-container.component.html',
  styleUrls: ['./boost-main-container.component.scss'],
})
export class BoostMainContainerComponent {

  // în proiectul real vei primi oferta dintr-un service / input
  show = true;

  offer: BoostOffer = {
    gameName: 'Valorant',
    currentRank: 'Gold II',
    desiredRank: 'Platinum I',
    currentRP: '2450',
    platform: 'PC',
    notes: 'Negociabil frate ',
    priceUSD: 100,
    sectionLabel: 'Section 1',
  };

  close() { this.show = false; }

  onDecline(){ console.log('Declined'); this.close(); }
  onCounter(){ console.log('Counter-offer'); /* deschizi alt view */ }
  onAccept(){  console.log('Accepted'); this.close(); }
}
