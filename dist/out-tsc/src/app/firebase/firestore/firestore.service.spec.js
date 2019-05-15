import { TestBed } from '@angular/core/testing';
import { FirestoreService } from './firestore.service';
describe('FirestoreService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(FirestoreService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=firestore.service.spec.js.map