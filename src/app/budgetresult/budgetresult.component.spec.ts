import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetresultComponent } from './budgetresult.component';

describe('BudgetresultComponent', () => {
  let component: BudgetresultComponent;
  let fixture: ComponentFixture<BudgetresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetresultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
