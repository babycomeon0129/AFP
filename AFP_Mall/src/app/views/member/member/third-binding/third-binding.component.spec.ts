import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdBindingComponent } from './third-binding.component';

describe('ThirdBindingComponent', () => {
  let component: ThirdBindingComponent;
  let fixture: ComponentFixture<ThirdBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
