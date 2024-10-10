import { Component } from '@angular/core';
import { Chat } from '../../../models/chat-models/chat';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  chats : Chat[] = []

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
  }

}
