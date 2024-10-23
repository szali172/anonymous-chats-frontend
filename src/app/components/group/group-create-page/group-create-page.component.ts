import { Component, Inject, inject, ViewChild } from '@angular/core';
import { CreateGroupDto } from '../../../models/group/create-group-dto';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { AsyncPipe, CommonModule} from '@angular/common';
import { MatFormFieldModule} from '@angular/material/form-field';
import { User } from '../../../models/user';
import { MatTable, MatTableModule } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-group-create-page',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './group-create-page.component.html',
  styleUrl: './group-create-page.component.css'
})
export class GroupCreatePageComponent {

  newGroupForm : FormGroup
  allUsers : User[] = []
  loggedInUser: string = '';
  filteredUsers : User[] = []
  availableUsers : Observable<User[]>
  selectedUsers : User[] = []
  userSelectControl  = new FormControl<string | User> ('')

  @ViewChild(MatTable) table! : MatTable<any>
  displayedColumns: string[] = ['userName', 'deleteButton'];
  

  constructor(private dialogRef: MatDialogRef<GroupCreatePageComponent>,
              private fb : FormBuilder,
              private userService : UserService,
              private groupService : GroupService,
              @Inject(MAT_DIALOG_DATA) public data: { loggedInUser : string } ) {
    
    this.loggedInUser = data.loggedInUser;
    
    this.userService.getAllUsers().subscribe({
      next:(users) =>  {
        // Remove admin (current user) from available users
        var index = users.findIndex(item => item.id === this.loggedInUser);
        users.splice(index, 1);
        this.allUsers = users;
      },
      error: (error) => {
        console.error('Error pulling all users', error);
      },
      complete: () => {
        console.debug('User pull complete.');
        this.updateFilteredUsers();
      }
    })

    this.newGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    })
        
    this.availableUsers = this.userSelectControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const username = typeof value === 'string' ? value : value?.userName;
        return username ? this._filter(username as string) : this.getUnselectedUsers();
      }),
    );
  }
  

  addUserToTable(user: User): void {
    if (!this.selectedUsers.find(x => x === user)) {
      this.selectedUsers.push(user);
      this.updateFilteredUsers();
      this.table.renderRows();
      this.userSelectControl.reset();
      
    } else {
      console.error("Unable to add user: User already exists in selection.")
    }
  }


  deleteUserFromTable(user: User): void {
    if (this.selectedUsers.find(x => x === user)) {
      var index = this.selectedUsers.indexOf(user, 0);
      this.selectedUsers.splice(index, 1);
      this.updateFilteredUsers();
      this.table.renderRows();

    } else {
      console.error("Unable to delete user: User does not exist in selections list.")
    } 
  }


  updateFilteredUsers(): void {
    this.filteredUsers = this.allUsers.filter(user => !this.selectedUsers.includes(user));
  }


  formIsValid(): boolean {
    return this.newGroupForm.valid && this.selectedUsers.length >= 5;
  }

  
  onSubmit(): void {
    if (this.formIsValid()) {
      const newGroup: CreateGroupDto = { 
        name: this.newGroupForm.controls['name'].value,
        userIds: this.selectedUsers.map(x => x.id).concat([this.loggedInUser]) // Add owner to their own group
      };

      this.groupService.createGroup(newGroup).subscribe({

        error: (error) => {
          console.error('Error creating group: ', error)
        },
        complete: () => {
          console.debug('Successfully created group.')
          this.dialogRef.close(201);
        }
      })
    }
  }


  displayFn(user: User): string {
    return user && user.userName ? user.userName : '';
  }


  private _filter(username: string): User[] {
    const filterValue = username.toLowerCase();
    return this.allUsers.filter(user => 
      !this.selectedUsers.includes(user) && 
      user.userName.toLowerCase().includes(filterValue)
    );
  }


  private getUnselectedUsers(): User[] {
    return this.allUsers.filter(user => !this.selectedUsers.includes(user));
  }
}