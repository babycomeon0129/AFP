import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCFooterComponent } from './pc-footer.component';

describe('PCFooterComponent', () => {
  let component: PCFooterComponent;
  let fixture: ComponentFixture<PCFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
