import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaptopOrdersComponent } from './laptop-orders.component';

describe('LaptopOrdersComponent', () => {
  let component: LaptopOrdersComponent;
  let fixture: ComponentFixture<LaptopOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaptopOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaptopOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
