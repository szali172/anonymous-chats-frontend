import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../models/chat-models/chat';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { ChatMessage } from '../../../models/chat-models/chat-message';
import { SideMenuComponent } from "../side-menu/side-menu.component";
import { CreateMessageDto } from '../../../models/chat-models/create-message-dto';
import { MessageComponent } from "../message/message.component";
import { ChatUser } from '../../../models/chat-models/chat-user';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, MessageComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {

  @Input({required : true}) selectedGroupId : number | null = 0;

  groupService = inject(GroupService);
  chatService = inject(ChatService);
  route = inject(ActivatedRoute);

  openChatId : number | null = null

  openChatMessages : ChatMessage[] =[];

  openChatUsers : ChatUser[] = [];
  chatUsersMapping : any = [];
  
  currentMessageDto : CreateMessageDto = {chatId: 0, originalMessage: "hi mom", filteredMessage: "hi mom"}

  ngOnInit() {
    //grab the id from the url
    this.selectedGroupId = Number(this.route.snapshot.paramMap.get("groupId"));
    
    this.loadChatMessages(this.selectedGroupId);  // Temporary, it needs to be passed in a chatId
    // this.loadChatUsers(this.openChatId);
  }

  
  loadChatMessages(openChatId : number){
    this.chatService.getChatMessages(openChatId).subscribe({
      next:(data) => {
        this.openChatMessages = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error pulling Chat Messages', error)
      },
      complete: () => {
        console.log('Chat Message pull complete.')
      }
    })

    //sorts the messages by their creation date
    this.openChatMessages.sort((a,b) => a.createdOn.getTime() - b.createdOn.getTime())
  }

  loadChatUsers(chatId : number) {
    this.chatService.getChatUsers(chatId).subscribe({
      next: (users) => {
        this.openChatUsers = users;
        this.mapUsers();
        console.log(this.chatUsersMapping);
      }
    })
  }


  mapUsers() {
    this.openChatUsers.forEach(x => this.chatUsersMapping.push({
      key: x.userId,
      value: x.pseudonym
    }))
  }
  
  
}

