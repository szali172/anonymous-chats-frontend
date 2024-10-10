import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupMenuComponent } from "./components/group-menu/group-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GroupMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anonymous-chats-frontend';
}
