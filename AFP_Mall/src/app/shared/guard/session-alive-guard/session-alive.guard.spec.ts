import { TestBed, async, inject } from '@angular/core/testing';

import { SessionAliveGuard } from './session-alive.guard';

describe('SessionAliveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionAliveGuard]
    });
  });

  it('should ...', inject([SessionAliveGuard], (guard: SessionAliveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
