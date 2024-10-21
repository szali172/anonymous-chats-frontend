import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPageContainerComponent } from './chat-page-container.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChatPageContainerComponent', () => {
  let component: ChatPageContainerComponent;
  let fixture: ComponentFixture<ChatPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPageContainerComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
