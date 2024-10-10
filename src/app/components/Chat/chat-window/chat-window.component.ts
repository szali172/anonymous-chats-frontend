import { Component } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../models/chat-models/chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {


}
