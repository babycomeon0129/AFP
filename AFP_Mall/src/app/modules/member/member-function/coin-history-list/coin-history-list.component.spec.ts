import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinHistoryListComponent } from './coin-history-list.component';

describe('CoinHistoryListComponent', () => {
  let component: CoinHistoryListComponent;
  let fixture: ComponentFixture<CoinHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
