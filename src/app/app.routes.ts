import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { ChatWindowComponent } from './components/Chat/chat-window/chat-window.component';

export const routes: Routes = [
    {path: '', component: GroupMenuComponent},
    {path: 'chats/:groupId', component: ChatWindowComponent},
];
