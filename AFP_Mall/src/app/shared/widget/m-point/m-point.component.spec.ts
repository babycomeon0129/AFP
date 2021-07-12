import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPointComponent } from './m-point.component';

describe('MPointComponent', () => {
  let component: MPointComponent;
  let fixture: ComponentFixture<MPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
