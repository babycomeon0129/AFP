import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellVerificationComponent } from './cell-verification.component';

describe('CellVerificationComponent', () => {
  let component: CellVerificationComponent;
  let fixture: ComponentFixture<CellVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
