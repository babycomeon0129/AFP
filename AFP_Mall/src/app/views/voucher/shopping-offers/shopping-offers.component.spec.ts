import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingOffersComponent } from './shopping-offers.component';

describe('ShoppingOffersComponent', () => {
  let component: ShoppingOffersComponent;
  let fixture: ComponentFixture<ShoppingOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
