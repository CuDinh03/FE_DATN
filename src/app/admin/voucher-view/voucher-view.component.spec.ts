import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherViewComponent } from './voucher-view.component';

describe('VoucherViewComponent', () => {
  let component: VoucherViewComponent;
  let fixture: ComponentFixture<VoucherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
