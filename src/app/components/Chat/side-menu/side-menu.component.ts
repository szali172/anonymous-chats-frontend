import { Component } from '@angular/core';
import { Chat } from '../../../models/chat-models/chat';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ChatUser } from '../../../models/chat-models/chat-user';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { UserGuess } from '../../../models/chat-models/user-guess';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  chats : Chat[] = []
  chatUsers : ChatUser[] = []
  chatMessages : ChatMessage[] = []
  userGuesses : UserGuess[] = []
  userGuess : UserGuess = {id: 1, chatId:1, guesserId: "1", guesseeId: "4", actualId: "11", createdOn: new Date("2019-01-16") }
  chatMessage : ChatMessage = {id: 1, originalMessage: "asdfasdf", filteredMessage: "asfdfsdafsdaafsd", chatId: 1}
  
  toggleState: boolean = false

  constructor(private chatService : ChatService) {}


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
    this.chatService.getChatMessages(1).subscribe({
      next:(data) => {
        this.chatMessages = data;
      },
      error: (error) => {
        console.error('Error pulling Chat Messages', error)
      },
      complete: () => {
        console.log('Chat Message pull complete.')
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
