import { Component, inject } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group/group';
import { CreateGroupDto } from '../../models/group/create-group-dto';
import { UpdateGroupDto } from '../../models/group/update-group-dto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

const USERID = "1";

@Component({
  selector: 'app-group-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-menu.component.html',
  styleUrl: './group-menu.component.css'
})
export class GroupMenuComponent {
  auth = inject(AuthService);
  groupService = inject(GroupService);
  userGroups: Group[] = [];


  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.loadUserGroups(user?.sub);
    });
  }

  loadUserGroups(userId: string = "") {
    // this.groupService.getUserGroups(userId).subscribe(groups => { // Remove after Azure setup
    this.groupService.getUserGroups(USERID).subscribe(groups => {
      this.userGroups = groups
      console.log(groups);
    });
  }
}
