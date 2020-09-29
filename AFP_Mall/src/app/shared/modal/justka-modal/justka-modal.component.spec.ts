import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustkaModalComponent } from './justka-modal.component';

describe('JustkaModalComponent', () => {
  let component: JustkaModalComponent;
  let fixture: ComponentFixture<JustkaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JustkaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustkaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
