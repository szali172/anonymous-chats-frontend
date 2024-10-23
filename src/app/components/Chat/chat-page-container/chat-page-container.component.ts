import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatWindowComponent } from "../chat-window/chat-window.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat/chat-message';
import { ChatUser } from '../../../models/chat/chat-user';
import { ChatGuess } from '../../../models/chat/chat-guess';
import { CompleteChat } from '../../../models/chat/complete-chat';
import { Chat } from '../../../models/chat/chat';
import { ChatService } from '../../../services/chat.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule, MatMenuItem } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { map, Observable, shareReplay, interval, Subscription, forkJoin } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'
import { Group } from '../../../models/group/group';
import { GroupService } from '../../../services/group.service';
import { RouterModule } from '@angular/router';
import { MembersListComponent } from '../members-list/members-list.component';
import { UserSelectComponent } from '../user-select/user-select.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateService } from '../../../services/date.service';
import { AuthService } from '@auth0/auth0-angular';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-chat-page-container',
  standalone: true,
  imports: [
    ChatWindowComponent,
    CommonModule,
    ChatWindowComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule, MatMenuItem,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    AsyncPipe,
    ChatWindowComponent,
    MatInputModule, //group selector field
    MatSelectModule, //group selector field
    MatFormFieldModule, //group selector field
    RouterModule,
    FormsModule, //group selector field
    LoadingSpinnerComponent,
  ],
  templateUrl: './chat-page-container.component.html',
  styleUrl: './chat-page-container.component.css'
})


export class ChatPageContainerComponent implements OnInit, OnDestroy {
  @ViewChild(ChatWindowComponent) chatWindowComponent!: ChatWindowComponent;

  private breakpointObserver = inject(BreakpointObserver);
  private groupService = inject(GroupService);
  private chatService = inject(ChatService);
  private dateService = inject(DateService);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  private timerSubscription!: Subscription;
  public isLoaded : boolean = false


  @Input({required : true}) selectedGroup : Group = history.state;
  isGroupAdmin: boolean = false;
  
  //need to replace user with auth info
  loggedInUser : string = "1"

  //declare all of the various things needed for functionality. 
  //Look to refactor later potentially and avoid needing to use this many
  // chatMessages : ChatMessage[] = []
  // userGuesses : ChatGuess[] = []
  // userGroups : Group[] = []
  // allChatUsers : Array<ChatUser[]> = []

  // chats : Chat[] = []
  isChatSelected : boolean = false
  completeChats: CompleteChat[] = []
  selectedCompleteChat : CompleteChat | undefined;
  chatCreationLoading: boolean = false;
  // isLoaded: boolean = false
  
  remainingTime: string = ''; // Timer display value
  
  
  //on load grab all available chat objects with associated users
  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if(user?.sub)
        this.loggedInUser = user.sub
      this.getUserChats();
    });




  }


  ngOnDestroy(): void {
    // Clean up the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  

  //shamelessly stolen from groupmenu component
  // getUserGroups() {
  //   this.groupService.getUserGroups(this.loggedInUser).subscribe(groups => {
  //     this.userGroups = groups
  //   })
  // }
  

  
  getUserChats() {
    this.chatService.getUserChats(this.loggedInUser, this.selectedGroup.id).subscribe({
      next:(chats) => {
        this.buildCompleteChats(chats);
      },
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.debug('Chat pull complete.')

            // this.getUserGroups();
          this.checkIfGroupAdmin();

          // Start the SignalR connection and join each of the chats
          this.chatService.startConnection().then(() => {
            this.completeChats.forEach(completeChat => {
              this.chatService.joinChatGroup(completeChat.chat.id);
            });
          });

          // Subscribe to incoming messages
          this.chatService.onMessageReceived().subscribe((message: ChatMessage) => {
            this.handleIncomingMessage(message);
          });
      }
    })
  }


  createChats(): void {
    this.chatCreationLoading = true;  // update loading status
    this.chatService.createChats(this.selectedGroup.id).subscribe({
      next: (chats) => {
        // filter list to find chat the current user is in
        // reload page to display new chat
      },
      error: (error) => {
        console.error(`Failed to create groups for ${this.selectedGroup.id}: `, error);
      },
      complete: () => {
        console.debug("Chat creation complete");
        this.chatCreationLoading = false;
        this.snackBar.openFromComponent(SnackBarMessageComponent, {duration: 5000})
        this.getUserChats();  // refetch list of chats
      }
    })
  }


  /* ========== Helper Methods ========== */

  // on success of pulling all chat users, starts the 
  // process to consolidate into a single user chat object
  buildCompleteChats(chats: Chat[]): void {
    this.completeChats = [];  // Clear previous chats

    const chatObservables = chats.map(chatObj => 
      this.chatService.getChatUsers(chatObj.id).pipe(
        map(chatUsers => ({
          chat: chatObj,
          chatUsers: chatUsers
        }))
      )
    );
  
    forkJoin(chatObservables).subscribe(completeChats => {
      this.completeChats = this.dateService.sortCompleteChatsByDate(completeChats);
    });

    this.isLoaded = true
  }


  getChatPseudonymsAsString(chat?: CompleteChat | null) : string {
    if (chat) {
      return chat.chatUsers.map(x => x.pseudonym).join(', ');
    } else if (this.selectedCompleteChat) {
      return this.selectedCompleteChat.chatUsers.map(x => x.pseudonym).join(', ');
    } else {
      console.error('Failed to get chat pseudonyms as a string');
      return '';
    }
    
  }


  getChatPseudonymsAsArray(chat?: CompleteChat | null) : string[] {
    if (chat) {
      return chat.chatUsers.map(x => x.pseudonym);
    } else if (this.selectedCompleteChat) {
      return this.selectedCompleteChat.chatUsers.map(x => x.pseudonym);
    } else {
      console.error('Failed to get chat pseudonyms as an array');
      return [];
    }
  }


  //this should be refactored to use filters as the data isn't super reliable
  // buildUserChats() { 
  //   for(let i = 0; i < this.chats.length; i++) {

  //     this.completeChats.push({
  //       chat: this.chats[i],
  //       chatUsers: this.allChatUsers[i]
  //     })
  //   }
  //   this.isLoaded = true;
  // }


  checkIfGroupAdmin(): void {
    this.auth.user$.subscribe((user) => {
      if (user?.sub === this.selectedGroup.createdBy) {
        this.isGroupAdmin = true;
      }
    })
  }

  
  // Handle new incoming messages
  handleIncomingMessage(message: ChatMessage) {
    // If the message is for the currently selected chat, add it to the open chat messages
    if (message.chatId === this.selectedCompleteChat?.chat?.id) {
      console.debug("MESSAGE: ", message);
      this.chatWindowComponent.handleChatMessage(message)
    } else {
      // Handle notifications for messages in other chats (optional)
      console.debug('New message for another chat:', message);
    }
  }


  //used to map the selected CompleteChat obect and pass it down to the chat window
  selectChatEvent(inputChatId : number) {
    // If current chat matches clicked chat, do nothing
    if (this.selectedCompleteChat && inputChatId === this.selectedCompleteChat.chat.id) {
      return;
    }

    this.selectedCompleteChat = this.completeChats.find(x => x.chat.id === inputChatId);
    // if (!this.isChatSelected)
    // {
    //   // the use of '!' requires that this never be undefined, overriding the requirement from .find() that would return it as <T> | undefined
      
      
    //   if(this.selectedCompleteChat === undefined) {
    //     console.error("Error retreiving complete chat object.");
    //   }

    this.startTimer();
    // }
  }


  openMembersList(): void {
    const dialogRef = this.dialog.open(MembersListComponent, {
      maxWidth: "lg",
      data: { groupObject: this.selectedGroup }
    });
  }


  openGuessPage() {
    const openGuess = this.dialog.open(UserSelectComponent, {
      data: {thisId : this.selectedCompleteChat!.chat.id},
      width: '75vw',
      height: '75vh',
      maxWidth: '90vw',
      maxHeight: '90vh'
    })
    openGuess.afterClosed().subscribe();
  }


  isChatClosed() : boolean {
    return this.dateService.isChatClosed(this.selectedCompleteChat?.chat);
  }

 
  getRemainingTime(): string {
    return this.dateService.getRemainingTime(this.selectedCompleteChat?.chat);
  }


  isTimeBelowTenMinutes(): boolean {
    return this.dateService.isTimeBelowTenMinutes(this.selectedCompleteChat?.chat);
  }


  private startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Unsubscribe from any previous timer
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime = this.getRemainingTime();
    });
  }
  

  //Observer that looks for screensize then changes the sidebar to be accessible for mobile
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}



@Component({
  selector: 'snack-bar-message',
  templateUrl: 'snack-bar-message.html',
  styles: `
    :host {
      display: flex;
    }

    #message {
      color: white;
    }

    #button {
      color: hotpink;
    }
  `,
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class SnackBarMessageComponent {
  snackBarRef = inject(MatSnackBarRef);
}