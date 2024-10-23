import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { FormControl, FormsModule } from '@angular/forms';
import { TextFilterService } from '../../../services/text-filter.service';
import { DateService } from '../../../services/date.service';
import { MatDividerModule } from '@angular/material/divider';
import { EndOfChatInfoComponent } from '../end-of-chat-info/end-of-chat-info.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { FilteredChatMessage } from '../../../models/chat/filtered-chat-message';
import { filter } from 'rxjs';
import { ChatGuess } from '../../../models/chat/chat-guess';


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
    MatDividerModule,
    LoadingSpinnerComponent,
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
  @Input({required : true}) loggedInUser! : string

  openChatMessages: ChatMessage[] = [];
  openChatUsers: ChatUser[] = []
  chatUsersMapping: Map<string, string> = new Map<string, string>()
  openChatUserGuesses: ChatGuess[] = [];

  //state controls
  isChatClosed: boolean = true;
  isLoaded : boolean = false;

  //message vars
  chatMessageInput = ''
  tempChatMessage = ''  // Holds on to chatMessage when it's cleared
  filteredChatMessageInput = ''
  previousMessageAuthor = '';


  ngOnInit(): void {
    this.intializeWindow();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCompleteChat']) {
      this.intializeWindow();
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }


  intializeWindow(): void {
    this.openChatUsers = this.selectedCompleteChat.chatUsers
    this.mapUsers();
    this.loadChatMessages(this.selectedCompleteChat.chat.id);

    setTimeout(() => {
      this.isChatClosed = this.dateService.isChatClosed(this.selectedCompleteChat.chat);
      this.getUserGuesses();
    }, 0);
  }

  
  loadChatMessages(openChatId : number): void {
    this.chatService.getChatMessages(openChatId).subscribe({
      next:(messages) => {
        this.openChatMessages = this.dateService.sortMessagesByDate(messages);
      },
      error: (error) => {
        console.error('Error pulling Chat Messages', error)
      },
      complete: () => {
        console.debug('Chat Message pull complete.');
        this.scrollToBottom();
        this.isLoaded = true;
      }
    })
  }
  

  //need to fix the service returning an obj with result: string instead of a direct string.
  filterChatMessage(): void {
    if (this.chatMessageInput.length > 0) {
      this.tempChatMessage = this.chatMessageInput;
      this.chatMessageInput = '';  // Reset input before going through filter api

      let filterObject : FilteredChatMessage;
      this.textFilterService.filterChatmessage(this.tempChatMessage).subscribe({
        next:(data) => {
          filterObject = data
          this.filteredChatMessageInput = filterObject.result
        },
        error: (error) => {
          console.error('Error sending filter message', error)
        },
        complete: () => {
          console.debug('Filter Message Complete')
          this.sendChatMessage()
        }
      })
    }
  }

  //grab the userGuesses to pass to child components. should realistically be passed up one level but thats for later.
  getUserGuesses() {
    this.chatService
      .getUserGuesses(this.selectedCompleteChat.chat.id, this.loggedInUser)
      .subscribe({
        next: (data) => {
          this.openChatUserGuesses = data;
        },
        error: (error) => {
          console.error('Error pulling all user guesses', error);
        },
        complete: () => {
          console.debug('User pull complete.');
          console.debug(this.openChatUserGuesses);
        },
      });
  }

  sendChatMessage(): void {
    const createMessageDto: CreateMessageDto = {
      chatId: this.selectedCompleteChat.chat.id,
      originalMessage: this.tempChatMessage,
      filteredMessage: this.filteredChatMessageInput
    }

    this.chatService.createChatMessage(createMessageDto).subscribe({
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.debug('Chat send complete.');
        this.tempChatMessage = '';  // Clear temp message once successfully posted
      }
    })    
  }


  //this takes in a message sent from the signalR to Parent component
  handleChatMessage(message : ChatMessage) {
    this.openChatMessages.push(message);
    this.scrollToBottom();
  }


  mapUsers() {
    //converted to actual mapping function
    //this.chatUsersMapping = []; // Clear previous mappings
    // this.openChatUsers.forEach(x => this.chatUsersMapping.push({
    //   key: x.userId,
    //   value: x.pseudonym
    // }))

    this.chatUsersMapping.clear()
    this.openChatUsers.forEach(x => this.chatUsersMapping.set(x.userId,x.pseudonym))
  }


  pullMessagePseudonym(message : ChatMessage): string | undefined {
    if (this.chatUsersMapping.get(message.createdBy) === undefined) {
      return "Placeholder username";
    } else {
      return this.chatUsersMapping.get(message.createdBy)
    }
  }


  // Return true if the previous message's author matches this current message
  // This is to remove the redundant author names above repeated messages from one user
  isPreviousAuthor(author: string) : boolean {
    const tempPrevAuthor = this.previousMessageAuthor;
    this.previousMessageAuthor = author;
    return author === tempPrevAuthor;
  }


  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'Enter' ||
        event.shiftKey && event.key === 'Enter')  {
      this.chatMessageInput += '\n';

    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.filterChatMessage();
    }
  }
  

  scrollToBottom(): void {
    setTimeout(() => {
      const chat = document.getElementById("message-window")
      if (chat)
      {
        chat.scrollTop = chat.scrollHeight
      }
    },50)
  }
}

