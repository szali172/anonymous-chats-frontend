import { Component, inject} from '@angular/core';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group/group';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { GroupCreatePageComponent } from '../group-create-page/group-create-page.component';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';


const USERID = "1";

@Component({
  selector: 'app-group-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDialogModule, LoadingSpinnerComponent],
  templateUrl: './group-menu.component.html',
  styleUrl: './group-menu.component.css'
})
export class GroupMenuComponent {
  auth = inject(AuthService);
  groupService = inject(GroupService);
  userGroups: Group[] = [];
  isLoaded : boolean = false;
  readonly dialog = inject(MatDialog)
  private snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    this.initializeWindow();
  }


  initializeWindow(): void {
    this.auth.user$.subscribe((user) => {
      this.loadUserGroups(user?.sub);
    });
  }

  loadUserGroups(userId: string = ""): void {
    // this.groupService.getUserGroups(userId).subscribe(groups => { // Remove after Azure setup
    this.groupService.getUserGroups(USERID).subscribe(groups => {
      this.userGroups = groups
      console.log(groups);
      this.isLoaded = true;
    });
  }

  openCreateGroupPage(): void {
    const createGroup = this.dialog.open(GroupCreatePageComponent, {
      width: '700px'
    })
    createGroup.afterClosed().subscribe(result => {
      if (result === 201) {
        this.initializeWindow();
        this.snackBar.openFromComponent(SnackBarMessageComponent, {duration: 5000})
      }
    });
  }

  logout() {
    this.auth.logout()
  }
}



@Component({
  selector: 'snack-bar-message',
  templateUrl: 'snack-bar-message.html',
  styles: `
    :host {
      display: flex;
    }

    #message {
      color: white;
    }

    #button {
      color: hotpink;
    }
  `,
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class SnackBarMessageComponent {
  snackBarRef = inject(MatSnackBarRef);
}