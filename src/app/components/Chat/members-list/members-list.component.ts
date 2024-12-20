import { Component, Inject, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../services/group.service';
import { User } from '../../../models/user';
import { MatListModule } from '@angular/material/list'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@auth0/auth0-angular';
import { Group } from '../../../models/group/group';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, MatListModule, ScrollingModule, MatIcon, MatTooltipModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent {
  groupService = inject(GroupService)

  group : Group;
  groupMembers: User[] = [];
  loggedInUser: string = "";

  constructor(
    public dialogRef: MatDialogRef<MembersListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupObject: Group, loggedInUser: string}) 
  {
    this.group = data.groupObject;
    this.loggedInUser = data.loggedInUser;
  }

  
  ngOnInit(): void {
    this.loadGroupUsers();
  }

  loadGroupUsers(): void {
    this.groupService.getGroupUsers(this.group.id).subscribe(userList => {
      console.log("Retrieving users", userList);
      this.groupMembers = userList;
    });
  }

  isCurrentUser(userId: string) : boolean {
    return this.loggedInUser === userId;
  }

  isGroupAdmin(userId: string) : boolean {
    return this.group.createdBy === userId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
