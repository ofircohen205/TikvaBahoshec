import { TestBed } from '@angular/core/testing';

import { SupportRepsService } from './support-reps.service';

describe('SupportRepsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportRepsService = TestBed.get(SupportRepsService);
    expect(service).toBeTruthy();
  });
});
