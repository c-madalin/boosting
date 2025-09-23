import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostOfferAllertComponent } from './boost-offer-allert.component';

describe('BoostOfferAllertComponent', () => {
  let component: BoostOfferAllertComponent;
  let fixture: ComponentFixture<BoostOfferAllertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostOfferAllertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostOfferAllertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
