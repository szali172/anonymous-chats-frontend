import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../models/chat-models/chat';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../services/group.service';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { SideMenuComponent } from "../side-menu/side-menu.component";
import { CreateMessageDto } from '../../../models/chat-models/create-message-dto';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {

  @Input() selectedGroupId : number = 0;

  groupService = inject(GroupService);
  chatService = inject(ChatService)

  openChat : number | null = null
  
  currentMessageDto : CreateMessageDto = {chatId: 0, originalMessage: "hi mom", filteredMessage: "hi mom"}


}

