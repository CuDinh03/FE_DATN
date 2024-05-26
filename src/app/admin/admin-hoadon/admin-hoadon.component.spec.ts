import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHoadonComponent } from './admin-hoadon.component';

describe('AdminHoadonComponent', () => {
  let component: AdminHoadonComponent;
  let fixture: ComponentFixture<AdminHoadonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHoadonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHoadonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
