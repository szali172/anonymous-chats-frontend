import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat/chat-message';
import { CreateMessageDto } from '../../../models/chat/create-message-dto';
import { MessageComponent } from "../message/message.component";
import { ChatUser } from '../../../models/chat/chat-user';
import { CompleteChat } from '../../../models/chat/complete-chat';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TextFilterService } from '../../../services/text-filter.service';
import { DateService } from '../../../services/date.service';
import { MatDividerModule } from '@angular/material/divider';
import { EndOfChatInfoComponent } from '../end-of-chat-info/end-of-chat-info.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    EndOfChatInfoComponent,
    ScrollingModule,
    TextFieldModule,
    MatInputModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) private scrollViewport!: CdkVirtualScrollViewport;
  
  chatService = inject(ChatService);
  textFilterService = inject(TextFilterService);
  dateService = inject(DateService);

  @Input({required : true}) selectedCompleteChat! : CompleteChat;

  openChatMessages: ChatMessage[] = [];
  openChatUsers: ChatUser[] = []
  chatUsersMapping: any = [];
  isChatClosed: boolean = false;
  loggedInUser = "1" // TODO: Remove later plzzzz

  chatMessageInput = ''
  previousMessageAuthor = '';

  ngOnInit(): void {
    this.openChatUsers = this.selectedCompleteChat.chatUsers
    this.loadChatMessages(this.selectedCompleteChat.chat.id);
    this.mapUsers();
    this.isChatClosed = this.dateService.isChatClosed(this.selectedCompleteChat.chat);
  }

  
  loadChatMessages(openChatId : number): void {
    this.chatService.getChatMessages(openChatId).subscribe({
      next:(data) => {
        this.openChatMessages = data;
        this.openChatMessages.sort((a,b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
      },
      error: (error) => {
        console.error('Error pulling Chat Messages', error)
      },
      complete: () => {
        console.debug('Chat Message pull complete.');
        this.scrollToBottom();
      }
    })
  }
  

  //need to fix the service returning an obj with result: string instead of a direct string.
  filterChatMessage(): void {
    this.textFilterService.filterChatmessage(this.chatMessageInput).subscribe({
      next:(data) => {
        this.chatMessageInput = data
      },
      error: (error) => {
        console.error('Error sending filter message', error)
      },
      complete: () => {
        console.debug('Filter Message Complete')
      }
    })
  }


  sendChatMessage(): void {
    const createMessageDto: CreateMessageDto = {
      chatId: this.selectedCompleteChat.chat.id,
      originalMessage: this.chatMessageInput,
      filteredMessage: this.chatMessageInput  // TODO: Needs to be filtered with API, becareful: if calling the filter method above, it's going to return an empty string because the subscribe method runs async. You'll need to do stuff with observers like in end-of-chat-info component
    }

    this.chatMessageInput = '';

    this.chatService.createChatMessage(createMessageDto).subscribe({
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.debug('Chat send complete.')
      }
    })    
  }


  mapUsers() {
    this.openChatUsers.forEach(x => this.chatUsersMapping.push({
      key: x.userId,
      value: x.pseudonym
    }))
  }


  pullMessagePseudonym(message : ChatMessage): string {
    if (this.chatUsersMapping[message.createdBy] === undefined) {
      return "Placeholder username";
    } else {
      return this.chatUsersMapping[message.createdBy].value
    }
  }


  // Return true if the previous message's author matches this current message
  // This is to remove the redundant author names above repeated messages from one user
  isPreviousAuthor(author: string) : boolean {
    const tempPrevAuthor = this.previousMessageAuthor;
    this.previousMessageAuthor = author;
    return author === tempPrevAuthor;
  }
  

  scrollToBottom(): void {
    if (this.scrollViewport) {
      setTimeout(() => {
        const totalHeight = this.scrollViewport.measureScrollOffset('bottom');
        this.scrollViewport.scrollToOffset(totalHeight, 'smooth');
      }, 0); 
    }
  }
}

