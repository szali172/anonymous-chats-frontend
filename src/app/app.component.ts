import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWindowComponent } from "./components/Chat/chat-window/chat-window.component";
import { SideMenuComponent } from "./components/Chat/side-menu/side-menu.component";
import { GroupMenuComponent } from "./components/group-menu/group-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, ChatWindowComponent, SideMenuComponent, GroupMenuComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anonymous-chats-frontend';
}
