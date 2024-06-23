import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailViewComponent } from './product-detail-view.component';

describe('ProductDetailViewComponent', () => {
  let component: ProductDetailViewComponent;
  let fixture: ComponentFixture<ProductDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
