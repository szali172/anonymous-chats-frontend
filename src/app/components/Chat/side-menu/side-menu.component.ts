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


/*

CURRENTLY NOT USED

May have use on terms of a refactor to move things out of all being located in the chat page component. TBD. If decision is made to keep things in the chat page, should remove this component.  

*/





@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  toggleState: boolean = true
  @Input() selectedGroupId: number = 0
  @Input() completeChats : CompleteChat[] = []
  
  //need to replace user with auth info
  loggedInUser : string = "1"

  constructor(private chatService : ChatService) {}

  ngOnInit() {

  }


  //baseline objects used while testing service.




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
