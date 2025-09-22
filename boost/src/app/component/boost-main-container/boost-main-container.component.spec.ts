import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostMainContainerComponent } from './boost-main-container.component';

describe('BoostMainContainerComponent', () => {
  let component: BoostMainContainerComponent;
  let fixture: ComponentFixture<BoostMainContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostMainContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostMainContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
