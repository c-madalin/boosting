import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostOfferAlertComponent } from './boost-offer-alert.component';

describe('BoostOfferAlertComponent', () => {
  let component: BoostOfferAlertComponent;
  let fixture: ComponentFixture<BoostOfferAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostOfferAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostOfferAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
