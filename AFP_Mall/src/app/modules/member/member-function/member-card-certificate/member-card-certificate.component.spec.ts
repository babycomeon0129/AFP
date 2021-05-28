import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCardCertificateComponent } from './member-card-certificate.component';

describe('MemberCardCertificateComponent', () => {
  let component: MemberCardCertificateComponent;
  let fixture: ComponentFixture<MemberCardCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCardCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
