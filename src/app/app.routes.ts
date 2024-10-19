import { Routes } from '@angular/router';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ChatPageContainerComponent } from './components/chat-page-container/chat-page-container.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'chats/:groupId', component: ChatPageContainerComponent, canActivate: [AuthGuard]},
    {path: 'groups',component: GroupMenuComponent, canActivate: [AuthGuard]}
];
