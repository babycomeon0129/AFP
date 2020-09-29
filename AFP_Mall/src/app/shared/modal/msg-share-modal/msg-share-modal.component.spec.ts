import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgShareModalComponent } from './msg-share-modal.component';

describe('MsgShareModalComponent', () => {
  let component: MsgShareModalComponent;
  let fixture: ComponentFixture<MsgShareModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgShareModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgShareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
