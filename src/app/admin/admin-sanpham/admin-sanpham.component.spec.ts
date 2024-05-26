import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSanphamComponent } from './admin-sanpham.component';

describe('AdminSanphamComponent', () => {
  let component: AdminSanphamComponent;
  let fixture: ComponentFixture<AdminSanphamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSanphamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSanphamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
