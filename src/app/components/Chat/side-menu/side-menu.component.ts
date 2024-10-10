import { Component, Input } from '@angular/core';
import { Chat } from '../../../models/chat-models/chat';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ChatUser } from '../../../models/chat-models/chat-user';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { UserGuess } from '../../../models/chat-models/user-guess';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  //baseline objects used while testing service.
  chats : Chat[] = []
  chatUsers : ChatUser[] = []
  chatMessages : ChatMessage[] = []
  userGuesses : UserGuess[] = []
  userGuess : UserGuess = {id: 1, chatId:1, guesserId: "1", guesseeId: "4", actualId: "11", createdOn: new Date("2019-01-16") }
  chatMessage : ChatMessage = {id: 1, originalMessage: "asdfasdf", filteredMessage: "asfdfsdafsdaafsd", chatId: 1, createdBy: "1"}
  
  toggleState: boolean = false

  @Input() selectedGroupId: number | null = null

  constructor(private chatService : ChatService) {}

// all of these are testing methods. should be broken up into functions and called when needed in both chat window appss
  ngOnInit(): void {
    this.chatService.getUserChats("1",1).subscribe({
      next:(data) => {
        this.chats = data;
      },
      error: (error) => {
        console.error('Error pulling all users', error)
      },
      complete: () => {
        console.log('User pull complete.')
      }
    })

    this.chatService.getChatUsers(1).subscribe({
      next:(data) => {
        this.chatUsers = data;
      },
      error: (error) => {
        console.error('Error pulling all Chat Users', error)
      },
      complete: () => {
        console.log('Chat User pull complete.')
      }
    })

    this.chatService.getUserGuesses(3,"10").subscribe({
      next:(data) => {
        this.userGuesses = data;
      },
      error: (error) => {
        console.error('Error pulling all User Guesses', error)
      },
      complete: () => {
        console.log('User Guesses pull complete.')
      }
    })
    this.chatService.updateUserGuess(this.userGuess).subscribe({
      next:(data) => {
      },
      error: (error) => {
        console.error('Error Updating User Guess', error)
      },
      complete: () => {
        console.log('User guess update complete.')
      }
    })
    // this.chatService.createChatMessage(this.chatMessage).subscribe({
    //   next:(data) => {
    //   },
    //   error: (error) => {
    //     console.error('Error creating Chat message', error)
    //   },
    //   complete: () => {
    //     console.log('Chat Message creation complete.')
    //   }
    // })

  }

  

}
