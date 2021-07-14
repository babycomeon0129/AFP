import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPointsComponent } from './mpoints.component';

describe('MPointsComponent', () => {
  let component: MPointsComponent;
  let fixture: ComponentFixture<MPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
