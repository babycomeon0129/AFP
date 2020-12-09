import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFavoriteComponent } from './member-favorite.component';

describe('MemberFavoriteComponent', () => {
  let component: MemberFavoriteComponent;
  let fixture: ComponentFixture<MemberFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFavoriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
