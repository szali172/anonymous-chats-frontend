import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { CreateMessageDto } from '../../../models/chat-models/create-message-dto';
import { MessageComponent } from "../message/message.component";
import { ChatUser } from '../../../models/chat-models/chat-user';
import { CompleteChat } from '../../../models/chat-models/complete-chat';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TextFilterService } from '../../../services/text-filter.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageComponent, ScrollingModule, TextFieldModule, MatInputModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {

  @Input({required : true}) selectedCompleteChat! : CompleteChat;

  chatService = inject(ChatService);
  textFilterService = inject(TextFilterService)


  openChatMessages : ChatMessage[] =[];
  openChatUsers : ChatUser[] = []
  chatUsersMapping : any = [];
  loggedInUser = 1
  chatMessageInput = ''
  
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
    if (this.chatUsersMapping[message.createdBy] === undefined) {
      return "Placeholder username";
    } else {
      return this.chatUsersMapping[message.createdBy].value
    }
  }
  

  //need to fix the service returning an obj with result: string instead of a direct string.
  filterChatMessage() {
    this.textFilterService.filterChatmessage(this.chatMessageInput).subscribe({
      next:(data) => {
        this.chatMessageInput = data
      },
      error: (error) => {
        console.error('Error sending filter message', error)
      },
      complete: () => {
        console.log('Filter Message Complete')
        console.log(this.chatMessageInput)
      }
    })
  }

  sendChatMessage() {
    this.currentMessageDto.chatId = this.selectedCompleteChat.chat.id
    this.currentMessageDto.originalMessage = this.chatMessageInput
    //need to change to run function to filter before sending
    this.currentMessageDto.filteredMessage = this.chatMessageInput

    this.chatService.createChatMessage(this.currentMessageDto).subscribe({
      next:(data) => {
        //this.chats = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.log('Chat send complete.')

      }
    })

    }
  
}

