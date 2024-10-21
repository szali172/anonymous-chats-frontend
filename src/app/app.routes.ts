import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { ChatWindowComponent } from './components/Chat/chat-window/chat-window.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ChatPageContainerComponent } from './components/Chat/chat-page-container/chat-page-container.component';
import { MembersListComponent } from './components/members-list/members-list.component';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'groups',component: GroupMenuComponent},
    {path: 'chats', component: ChatPageContainerComponent},
];
