import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group/group-menu/group-menu.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ChatPageContainerComponent } from './components/Chat/chat-page-container/chat-page-container.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'chats', component: ChatPageContainerComponent, canActivate: [AuthGuard]},
    {path: 'groups',component: GroupMenuComponent, canActivate: [AuthGuard]}
];
