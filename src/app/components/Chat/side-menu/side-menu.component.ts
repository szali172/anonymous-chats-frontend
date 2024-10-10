import { Component, input, Input } from '@angular/core';
import { Chat } from '../../../models/chat-models/chat';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { ChatUser } from '../../../models/chat-models/chat-user';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { UserGuess } from '../../../models/chat-models/user-guess';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { CompleteChat } from '../../../models/chat-models/complete-chat';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  //baseline objects used while testing service.

  chatUsers : ChatUser[] = []
  chatMessages : ChatMessage[] = []
  userGuesses : UserGuess[] = []
  userGuess : UserGuess = {id: 1, chatId:1, guesserId: "1", guesseeId: "4", actualId: "11", createdOn: new Date("2019-01-16") }
  chatMessage : ChatMessage = {id: 1, originalMessage: "asdfasdf", filteredMessage: "asfdfsdafsdaafsd", chatId: 1, createdBy: "1", createdOn: new Date()}
  

  fakeUsers :string[] = ["Albatross", "Tex","Gerbil"]
  chats : Chat[] = []
  completeChats: CompleteChat[] = []
  toggleState: boolean = true

  //need to replace user with auth info
loggedInUser : string = "1"
@Input() selectedGroupId: number | null = 1

  constructor(private chatService : ChatService) {}

// all of these are testing methods. should be broken up into functions and called when needed in both chat window appss
  ngOnInit(): void {
    this.getUserChats()


    // this.chatService.getUserChats("1",1).subscribe({
    //   next:(data) => {
    //     this.chats = data;
    //   },
    //   error: (error) => {
    //     console.error('Error pulling all users', error)
    //   },
    //   complete: () => {
    //     console.log('User pull complete.')
    //   }
    // })

    // this.chatService.getChatUsers(1).subscribe({
    //   next:(data) => {
    //     this.chatUsers = data;
    //   },
    //   error: (error) => {
    //     console.error('Error pulling all Chat Users', error)
    //   },
    //   complete: () => {
    //     console.log('Chat User pull complete.')
    //   }
    // })

    // this.chatService.getUserGuesses(3,"10").subscribe({
    //   next:(data) => {
    //     this.userGuesses = data;
    //   },
    //   error: (error) => {
    //     console.error('Error pulling all User Guesses', error)
    //   },
    //   complete: () => {
    //     console.log('User Guesses pull complete.')
    //   }
    // })
    // this.chatService.updateUserGuess(this.userGuess).subscribe({
    //   next:(data) => {
    //   },
    //   error: (error) => {
    //     console.error('Error Updating User Guess', error)
    //   },
    //   complete: () => {
    //     console.log('User guess update complete.')
    //   }
    // })
    // // this.chatService.createChatMessage(this.chatMessage).subscribe({
    // //   next:(data) => {
    // //   },
    // //   error: (error) => {
    // //     console.error('Error creating Chat message', error)
    // //   },
    // //   complete: () => {
    // //     console.log('Chat Message creation complete.')
    // //   }
    // // })

  }

  getUserChats() {
    this.chatService.getUserChats(this.loggedInUser,1).subscribe({
      next:(data) => {
        this.chats = data;
      },
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.log('Chat pull complete.')
        console.log(`Number of chats found ${this.chats.length}`)
        console.log(this.chats[0])
      }
    })

  }
  getChatUsers(selectedChat : number) : ChatUser[] {

    //Add Users to the chat object
    let y : ChatUser[] = []
    this.chatService.getChatUsers(selectedChat).subscribe({
      next:(data) => {
        //this.completeChats[i].chatUsers = data;
        y = data;
      },
      error: (error) => {
        console.error('Error pulling all Chat Users', error)
      },
      complete: () => {
        console.log('Chat User pull complete.')
        
      }
    })
    return y
  }

  getChatMessages(selectedChat : number) : ChatMessage[] {
    var z : ChatMessage[] = []
        //add array of chat messages
        this.chatService.getChatMessages(selectedChat).subscribe({
          next:(data) => {
            //this.completeChats[i].chatMessages = data;
            z = data;
          },
          error: (error) => {
            console.error('Error pulling Chat Messages', error)
          },
          complete: () => {
            console.log('Chat Message pull complete.')
          }
        })
        return z;
  }

  buildUserChats() { 
    
  }
  

}
