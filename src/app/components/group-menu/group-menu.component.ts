import { Component, inject } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group/group';
import { CreateGroupDto } from '../../models/group/create-group-dto';
import { UpdateGroupDto } from '../../models/group/update-group-dto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const USERID = "20";

@Component({
  selector: 'app-group-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-menu.component.html',
  styleUrl: './group-menu.component.css'
})
export class GroupMenuComponent {

  groupService = inject(GroupService);
  userGroups: Group[] = [];


  ngOnInit() {
    this.loadUserGroups()
  }

  loadUserGroups() {
    this.groupService.getUserGroups(USERID).subscribe(groups => {
      this.userGroups = groups
      console.log(groups);
    });
  }
}
