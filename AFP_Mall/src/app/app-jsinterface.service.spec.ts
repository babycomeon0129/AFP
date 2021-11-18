import { TestBed } from '@angular/core/testing';

import { AppJSInterfaceService } from './app-jsinterface.service';

describe('AppJSInterfaceService', () => {
  let service: AppJSInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(AppJSInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
