import { Component, inject} from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group/group';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { GroupCreatePageComponent } from '../group-create-page/group-create-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const USERID = "1";

@Component({
  selector: 'app-group-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './group-menu.component.html',
  styleUrl: './group-menu.component.css'
})
export class GroupMenuComponent {
  auth = inject(AuthService);
  groupService = inject(GroupService);
  userGroups: Group[] = [];
  readonly dialog = inject(MatDialog)
  isLoaded : boolean = false


  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.loadUserGroups(user?.sub);
    });
  }

  loadUserGroups(userId: string = "") {
    // this.groupService.getUserGroups(userId).subscribe(groups => { // Remove after Azure setup
    this.groupService.getUserGroups(USERID).subscribe({
      next:(groups) => {
        this.userGroups = groups
        console.log(groups);
      },
      complete:() => {
        //clear the loading screen and display information
        this.isLoaded = true;
      }


      
    });
  }

  openCreateGroupPage() {
    const createGroup = this.dialog.open(GroupCreatePageComponent, {
      width: '75vw',
      maxWidth: '90vw',
      maxHeight: '90vh'
    })
    createGroup.afterClosed().subscribe(result => {
    });
  }
}
