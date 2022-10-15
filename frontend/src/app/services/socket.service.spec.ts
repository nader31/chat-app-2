import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { GroupService } from './group.service';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AuthService, GroupService, SocketService]
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
