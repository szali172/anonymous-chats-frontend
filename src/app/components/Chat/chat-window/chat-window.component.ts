import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { CreateMessageDto } from '../../../models/chat-models/create-message-dto';
import { MessageComponent } from "../message/message.component";
import { ChatUser } from '../../../models/chat-models/chat-user';
import { CompleteChat } from '../../../models/chat-models/complete-chat';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldModule } from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageComponent, ScrollingModule, TextFieldModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {

  @Input({required : true}) selectedCompleteChat! : CompleteChat;

  groupService = inject(GroupService);
  chatService = inject(ChatService);
  route = inject(ActivatedRoute);

  openChatMessages : ChatMessage[] =[];
  openChatUsers : ChatUser[] = []
  chatUsersMapping : any = [];
  loggedInUser = 1
  
  currentMessageDto : CreateMessageDto = {chatId: 0, originalMessage: "hi mom", filteredMessage: "hi mom"}

  ngOnInit() {
    //map local variables to the now populated complete chat
    this.openChatUsers = this.selectedCompleteChat.chatUsers
    this.loadChatMessages(this.selectedCompleteChat.chat.id);
    this.mapUsers();
  }

  
  loadChatMessages(openChatId : number){
    this.chatService.getChatMessages(openChatId).subscribe({
      next:(data) => {
        this.openChatMessages = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error pulling Chat Messages', error)
      },
      complete: () => {
        console.log('Chat Message pull complete.')
      }
    })
    //sorts the messages by their creation date
    this.openChatMessages.sort((a,b) => a.createdOn.getTime() - b.createdOn.getTime())
  }

  mapUsers() {
    this.openChatUsers.forEach(x => this.chatUsersMapping.push({
      key: x.userId,
      value: x.pseudonym
    }))
    console.log(this.openChatUsers)
  }

  pullMessagePseudonym(message : ChatMessage): string {
    return this.chatUsersMapping[message.createdBy].value
  }
  
  
}

