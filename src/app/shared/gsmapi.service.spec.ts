/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { GsmapiService } from './gsmapi.service';

describe('Gsmapi Service', () => {
  beforeEachProviders(() => [GsmapiService]);

  it('should ...',
      inject([GsmapiService], (service: GsmapiService) => {
    expect(service).toBeTruthy();
  }));
});
