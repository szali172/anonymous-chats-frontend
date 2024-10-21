import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfChatUserTableComponent } from './end-of-chat-user-table.component';

describe('EndOfChatUserTableComponent', () => {
  let component: EndOfChatUserTableComponent;
  let fixture: ComponentFixture<EndOfChatUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndOfChatUserTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndOfChatUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
