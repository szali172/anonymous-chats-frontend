import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { EndOfChatUserTableComponent } from "../end-of-chat-user-table/end-of-chat-user-table.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';
import { ChatGuess } from '../../../models/chat/chat-guess';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-end-of-chat-info',
  standalone: true,
  imports: [CommonModule, EndOfChatUserTableComponent, MatDividerModule, MatIconModule],
  templateUrl: './end-of-chat-info.component.html',
  styleUrl: './end-of-chat-info.component.css'
})
export class EndOfChatInfoComponent {
  chatService = inject(ChatService);
  userService = inject(UserService)

  @Input({required: true}) chatId!: number;
  @Input({required: true}) chatUsersMapping!: Map<string, string>;
  @Input({required: true}) loggedInUser : string = '';
  @Input({required: true}) openChatUserGuesses : ChatGuess[] = [];

  memberPseudonyms: string[] = [];
  guessedUsernames: string[] = [];
  actualUsernames: string[] = [];
  userCache: Record<string, string> = {};


  ngOnInit() {
    // this.loadChatGuesses();  // TODO: remove afterwards
    this.populateUsernames(this.openChatUserGuesses)
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] || changes['openChatUserGuesses']) {
      this.populateUsernames(this.openChatUserGuesses);
    }
  }


  // loadChatGuesses(userId: string = "") : void {
  //   // this.chatService.getUserGuesses(this.chatId, userId).subscribe(guesses => {
  //      this.chatService.getUserGuesses(22, "1").subscribe(guesses => {  // TODO: Remove plzzzzz
  //       this.populateUsernames(guesses);
  //   })
  // }


  populateUsernames(userGuesses: ChatGuess[]) : void {
    // Prepare arrays of observables for fetching guessed and actual usernames
    this.memberPseudonyms = [];  // Clear previous mappings
    const guessedUsernameObservables: Observable<string>[] = [];
    const actualUsernameObservables: Observable<string>[] = [];
    
    for (const chatGuess of userGuesses) {
      this.memberPseudonyms.push(this.chatUsersMapping.get(chatGuess.actualId) || '');

      guessedUsernameObservables.push(
        chatGuess.guesseeId !== null ? 
        this.getUsername(chatGuess.guesseeId) : of(''));
                          
      actualUsernameObservables.push(this.getUsername(chatGuess.actualId));
    }

    // Wait for observables to complete before updating arrays
    forkJoin(guessedUsernameObservables).subscribe((guessedNames => 
      { this.guessedUsernames = guessedNames; }))
    
    forkJoin(actualUsernameObservables).subscribe((actualNames =>
      { this.actualUsernames = actualNames; }))
  }
  

  getUsername(userId: string) : Observable<string> {
    // If user was previously fetched, use cached username
    if (userId in this.userCache) {
      console.info("Cache hit")
      return of(this.userCache[userId]);
    } 

    // User not cached, fetch user object
    return new Observable((observer) => {
      this.userService.getUser(userId).subscribe({

        next: (response: any) => {
          const user: User = response.result;
          if (user) {
            this.userCache[userId] = user.userName;  // cache fetched user
            observer.next(user.userName);
          } else {
            observer.error(`User with ID ${userId} not found`);
          }
        },
  
        error: (error) => {
          console.error(`Error fetching user ${userId}`, error)
          observer.error(error);
        },
        complete: () => observer.complete(),
      });
    })
  }

  
  getCorrectGuesses(): string[] {
    return this.guessedUsernames.filter(element => this.actualUsernames.includes(element));
  }
}
