import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingProductComponent } from './trending-product.component';

describe('TrendingProductComponent', () => {
  let component: TrendingProductComponent;
  let fixture: ComponentFixture<TrendingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
