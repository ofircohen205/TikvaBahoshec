import { TestBed } from '@angular/core/testing';
import { GlobalService } from './global.service';
describe('GlobalService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(GlobalService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=global.service.spec.js.map