import { TestBed, async, inject } from '@angular/core/testing';

import { LockedRoomGuard } from './locked-room.guard';

describe('LockedRoomGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LockedRoomGuard]
    });
  });

  it('should ...', inject([LockedRoomGuard], (guard: LockedRoomGuard) => {
    expect(guard).toBeTruthy();
  }));
});
