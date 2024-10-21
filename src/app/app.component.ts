import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWindowComponent } from "./components/Chat/chat-window/chat-window.component";
import { GroupMenuComponent } from "./components/group/group-menu/group-menu.component";
import { GroupCreatePageComponent } from "./components/group/group-create-page/group-create-page.component";
import { UserSelectComponent } from "./components/Chat/user-select/user-select.component";

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, ChatWindowComponent, GroupMenuComponent, GroupCreatePageComponent, UserSelectComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anonymous-chats-frontend';
}
