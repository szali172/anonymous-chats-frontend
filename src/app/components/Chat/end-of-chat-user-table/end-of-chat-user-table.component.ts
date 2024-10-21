import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-end-of-chat-user-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './end-of-chat-user-table.component.html',
  styleUrl: './end-of-chat-user-table.component.css'
})
export class EndOfChatUserTableComponent {

  @Input({required: true}) names: string[] = [];
  @Input() tableHeader: string = "";
  @Input() correctUsernames: string[] | null = null;  // Only used for "Actual Identities" table
}
