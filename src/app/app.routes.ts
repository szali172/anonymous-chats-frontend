import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { ChatWindowComponent } from './components/Chat/chat-window/chat-window.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'chats/:groupId', component: ChatWindowComponent},
    {path: 'groups',component: GroupMenuComponent}
];
