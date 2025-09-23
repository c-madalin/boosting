import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostingTableComponent } from './boosting-table.component';

describe('BoostingTableComponent', () => {
  let component: BoostingTableComponent;
  let fixture: ComponentFixture<BoostingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
