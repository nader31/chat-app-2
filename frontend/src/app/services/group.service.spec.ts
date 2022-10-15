import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

import { GroupService } from './group.service';

beforeEach(() => TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [AuthService, GroupService]
}));

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
