import { CommonModule } from '@angular/common';
import { Component, inject, input, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  dateService = inject(DateService);

  @Input({required: true}) message : string | null = "";
  @Input({required: true}) author : string | null = "";
  @Input({required: true}) pseudonym : string | undefined = "";
  @Input({required: true}) repeatedAuthor : boolean = false;
  @Input({required: true}) timeStamp! : Date;
  @Input({required: true}) loggedInUser! : string
}
