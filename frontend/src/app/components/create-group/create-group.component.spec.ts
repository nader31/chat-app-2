import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';

import { CreateGroupComponent } from './create-group.component';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AuthService, GroupService]
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
