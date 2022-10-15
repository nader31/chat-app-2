import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Group, GroupInfo } from 'src/app/models/group.model';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { SocketService } from '../../services/socket.service';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let service! : GroupService;
  let chatComponent: ChatComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports: [HttpClientTestingModule],
      providers: [AuthService,SocketService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set group property to the groups returned', () => {
    const groups:GroupInfo[] = [
      {
        id: '1',
        name: 'Technology'
      },
      {
        id: '2',
        name: 'Maths'
      },
      {
        id: '3',
        name: 'Friends'
      }
    ]
  });

  // spyOn(service, 'getGroups').and.callFake(() => {
  //   return Observable.from([groups]);
  // })
});
