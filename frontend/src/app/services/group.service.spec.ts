import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GroupFetched } from '../models/group.model';
import { AuthService } from './auth.service';

import { GroupService } from './group.service';

beforeEach(() => TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [AuthService, GroupService]
}));

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GroupService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve groups from the API via GET', () => {
    const dummyGroups:GroupFetched[] = [
      {
      _id: "1",
      name: "Technology",
      users: [
          {
              userId: "1",
              role: "admin",
          },
          {
              userId: "2",
              role: "member",
          }
        ],
      rooms: [
          {
              name: "Apple",
          },
          {
              name: "Samsung",
          }
        ],
      },
      {
      _id: "2 ",
      name: "Photography",
      users: [
          {
              userId: "2",
              role: "admin",
          },
          {
              userId: "3",
              role: "member",
          }
        ],
      rooms: [
          {
              "name": "Sony",
          },
          {
              "name": "Nikon",
          }
        ],
      }
    ]


    service.getGroups().subscribe((groups: GroupFetched[] | any[]) => {
      expect(groups.length).toBe(2);
      expect(groups).toEqual(dummyGroups);
    })

    const request = httpMock.expectOne(`${service.ROOT_URL }`);

    expect(request.request.method).toBe('GET');

    request.flush(dummyGroups);
  });
});
