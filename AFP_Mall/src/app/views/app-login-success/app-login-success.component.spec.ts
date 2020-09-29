import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginSuccessComponent } from './app-login-success.component';

describe('AppLoginSuccessComponent', () => {
  let component: AppLoginSuccessComponent;
  let fixture: ComponentFixture<AppLoginSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoginSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
