import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckyspinComponent } from './luckyspin.component';

describe('LuckyspinComponent', () => {
  let component: LuckyspinComponent;
  let fixture: ComponentFixture<LuckyspinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckyspinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckyspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
