import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfChatInfoComponent } from './end-of-chat-info.component';

describe('EndOfChatInfoComponent', () => {
  let component: EndOfChatInfoComponent;
  let fixture: ComponentFixture<EndOfChatInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndOfChatInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndOfChatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
