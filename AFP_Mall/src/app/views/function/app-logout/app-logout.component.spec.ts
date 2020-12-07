import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLogoutComponent } from './app-logout.component';

describe('AppLogoutComponent', () => {
  let component: AppLogoutComponent;
  let fixture: ComponentFixture<AppLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
