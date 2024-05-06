import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProductComponent } from './preview-product.component';

describe('PreviewProductComponent', () => {
  let component: PreviewProductComponent;
  let fixture: ComponentFixture<PreviewProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
