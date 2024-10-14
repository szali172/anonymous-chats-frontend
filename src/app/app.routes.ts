import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { ChatWindowComponent } from './components/Chat/chat-window/chat-window.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ChatPageContainerComponent } from './components/chat-page-container/chat-page-container.component';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'chats/:groupId', component: ChatPageContainerComponent},
    {path: 'groups',component: GroupMenuComponent}
];
