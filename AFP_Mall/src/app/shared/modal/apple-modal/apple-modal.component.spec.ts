import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleModalComponent } from './apple-modal.component';

describe('AppleModalComponent', () => {
  let component: AppleModalComponent;
  let fixture: ComponentFixture<AppleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
