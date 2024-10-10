import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWindowComponent } from "./components/Chat/chat-window/chat-window.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anonymous-chats-frontend';
}
