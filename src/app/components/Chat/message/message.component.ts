import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../models/chat-models/chat-message';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  @Input({required: true}) message : string | null = "";
  @Input({required: true}) author : string | null = "";
  @Input({required: true}) timeStamp : Date | string = "";
  USERID = '1';
}
