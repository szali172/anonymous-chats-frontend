import { Component, inject, Input } from '@angular/core';
import { ChatWindowComponent } from "../Chat/chat-window/chat-window.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { SideMenuComponent } from '../Chat/side-menu/side-menu.component';
import { ChatMessage } from '../../models/chat-models/chat-message';
import { ChatUser } from '../../models/chat-models/chat-user';
import { UserGuess } from '../../models/chat-models/user-guess';
import { CompleteChat } from '../../models/chat-models/complete-chat';
import { Chat } from '../../models/chat-models/chat';
import { ChatService } from '../../services/chat.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms'
import { Group } from '../../models/group/group';
import { GroupService } from '../../services/group.service';


@Component({
  selector: 'app-chat-page-container',
  standalone: true,
  imports: [
    ChatWindowComponent,
    CommonModule,
    SideMenuComponent,
    ChatWindowComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    ChatWindowComponent,
    MatInputModule, //group selector field
    MatSelectModule, //group selector field
    MatFormFieldModule, //group selector field
    FormsModule //group selector field
  ],
  templateUrl: './chat-page-container.component.html',
  styleUrl: './chat-page-container.component.css'
})
export class ChatPageContainerComponent {

  private breakpointObserver = inject(BreakpointObserver);
  private groupService = inject(GroupService);
  private chatService = inject(ChatService)

  //Observer that looks for screensize then changes the sidebar to be accessible for mobile
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @Input({required : true}) selectedGroupId : number | number = 1;
  //need to replace user with auth info
  loggedInUser : string = "11"


  //declare all of the various things needed for functionality. 
  //Look to refactor later potentially and avoid needing to use this many
  chatMessages : ChatMessage[] = []
  userGuesses : UserGuess[] = []
  userGroups : Group[] = []
  allChatUsers : Array<ChatUser[]> = []

  chats : Chat[] = []
  completeChats: CompleteChat[] = []
  isLoaded: boolean = false


  //on load grab all available chat objects with associated users
  //should look to pass the list of groups down from the group-menu to avoid an extra call
  ngOnInit(): void {
    this.getUserChats()
    this.getUserGroups()
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
    this.chatService.getUserChats(this.loggedInUser,this.selectedGroupId).subscribe({
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
    //Add Users to the chat object
      this.chatService.getChatUsers(i.chatId).subscribe({
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

}
