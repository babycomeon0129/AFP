import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreDetailComponent } from './explore-detail.component';

describe('ExploreDetailComponent', () => {
  let component: ExploreDetailComponent;
  let fixture: ComponentFixture<ExploreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
