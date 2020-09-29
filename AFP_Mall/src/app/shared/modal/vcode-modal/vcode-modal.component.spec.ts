import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcodeModalComponent } from './vcode-modal.component';

describe('VcodeModalComponent', () => {
  let component: VcodeModalComponent;
  let fixture: ComponentFixture<VcodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcodeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
