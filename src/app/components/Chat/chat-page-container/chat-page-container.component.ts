import { Component, inject, Input, ViewChild } from '@angular/core';
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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'
import { Group } from '../../../models/group/group';
import { GroupService } from '../../../services/group.service';
import { RouterModule } from '@angular/router';
import { MembersListComponent } from '../members-list/members-list.component';
import { UserSelectComponent } from '../user-select/user-select.component';


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
    ScrollingModule,
    AsyncPipe,
    ChatWindowComponent,
    MatInputModule, //group selector field
    MatSelectModule, //group selector field
    MatFormFieldModule, //group selector field
    RouterModule,
    FormsModule //group selector field
  ],
  templateUrl: './chat-page-container.component.html',
  styleUrl: './chat-page-container.component.css'
})


export class ChatPageContainerComponent {

  private breakpointObserver = inject(BreakpointObserver);
  private groupService = inject(GroupService);
  private chatService = inject(ChatService)
  readonly dialog = inject(MatDialog)

  //Check for if a chat is selected
  isChatSelected : boolean = false
  selectedChatId : number = 0
  selectedCompleteChat! : CompleteChat;
  @Input({required : true}) selectedGroup : Group = history.state;
  
  //need to replace user with auth info
  loggedInUser : string = "1"

  //declare all of the various things needed for functionality. 
  //Look to refactor later potentially and avoid needing to use this many
  chatMessages : ChatMessage[] = []
  userGuesses : ChatGuess[] = []
  userGroups : Group[] = []
  allChatUsers : Array<ChatUser[]> = []

  chats : Chat[] = []
  completeChats: CompleteChat[] = []
  isLoaded: boolean = false

  @ViewChild(ChatWindowComponent) chatWindowComponent!: ChatWindowComponent;
  
  //on load grab all available chat objects with associated users
  //should look to pass the list of groups down from the group-menu to avoid an extra call
  ngOnInit(): void {
    this.getUserChats()
    this.getUserGroups()

    // Start the SignalR connection and join each of the chats
    this.chatService.startConnection().then(() => {
      this.chats.forEach(chat => {
        this.chatService.joinChatGroup(chat.id);
      });
    });

    // Subscribe to incoming messages
    this.chatService.onMessageReceived().subscribe((message: ChatMessage) => {
      this.handleIncomingMessage(message);
    });
  }

  //shamelessly stolen from groupmenu component
  getUserGroups() {
    this.groupService.getUserGroups(this.loggedInUser).subscribe(groups => {
      this.userGroups = groups
      console.log(groups);
      })
    }
  
  //on successful pull of user chat list, starts pulling user chats
  getUserChats() {
    this.chatService.getUserChats(this.loggedInUser,this.selectedGroup!.id).subscribe({
      next:(data) => {
        this.chats = data;
      },
      error: (error) => {
        console.error('Error pulling all chats', error)
      },
      complete: () => {
        console.log('Chat pull complete.')
        console.log(this.chats)
        this.getChatUsers()
      }
    })
  }

  //on success of pulling all chat users, starts the process to consolidate into a single user chat object
  getChatUsers(){
    for(var i of this.chats)
    {
      console.log(i)
    //Add Users to the chat object
      this.chatService.getChatUsers(i.id).subscribe({
        next:(data) => {
          this.allChatUsers.push(data);
        },
        error: (error) => {
          console.error('Error pulling all Chat Users', error)
        },
        complete: () => {
          console.log('Chat User pull complete.')
          this.buildUserChats()
        }
      })
    }
  }

  getChatPseudonymsAsString(chat?: CompleteChat | null) : string {
    if (chat) {
      return chat.chatUsers.map(x => x.pseudonym).join(', ');
    }
    return this.selectedCompleteChat.chatUsers.map(x => x.pseudonym).join(', ');
  }

  //this should be refactored to use filters as the data isn't super reliable
  buildUserChats() { 
    for(let i = 0; i < this.chats.length; i++) {

      this.completeChats.push({
        chat: this.chats[i],
        chatUsers: this.allChatUsers[i]
      })
      console.log(this.completeChats[i])
    }
    this.isLoaded = true;
  }

  // Handle new incoming messages
  handleIncomingMessage(message: ChatMessage) {
    // If the message is for the currently selected chat, add it to the open chat messages
    if (message.chatId === this.selectedCompleteChat?.chat?.id) {
      console.log("MESSAGE: ", message);
      this.chatWindowComponent.openChatMessages.push(message);
    } else {
      // Handle notifications for messages in other chats (optional)
      console.log('New message for another chat:', message);
    }
  }

  //used to map the selected CompleteChat obect and pass it down to the chat window
  selectChatEvent(inputChatId : number) {
    this.isChatSelected = !this.isChatSelected
    if (this.isChatSelected)
    {
      // the use of '!' requires that this never be undefined, overriding the requirement from .find() that would return it as <T> | undefined
      this.selectedCompleteChat = this.completeChats.find(x => x.chat.id === inputChatId)!;
      console.log(this.selectedCompleteChat)
      if(this.selectedCompleteChat == undefined)
        console.log("Error retreiving complete chat object.")
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(MembersListComponent, {
      maxWidth: "lg",
      data: { groupObject: this.selectedGroup }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  openGuessPage() {
    const openGuess = this.dialog.open(UserSelectComponent, {
      data: {thisId : this.selectedChatId},
      width: '75vw',
      height: '75vh',
      maxWidth: '90vw',
      maxHeight: '90vh'
    })
    openGuess.afterClosed().subscribe(result => {
      console.log('The guess window was closed')
      if (result !== undefined) {
        console.log(result)
        //do something with guess informaiton here
      }
    });
  }
  

  //Observer that looks for screensize then changes the sidebar to be accessible for mobile
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}

