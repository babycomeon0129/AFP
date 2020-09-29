import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetModalComponent } from './forget-modal.component';

describe('ForgetModalComponent', () => {
  let component: ForgetModalComponent;
  let fixture: ComponentFixture<ForgetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
