import { Component, ViewChild } from '@angular/core';
import { CreateGroupDto } from '../../models/group/create-group-dto';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { AsyncPipe} from '@angular/common';
import { MatFormFieldModule} from '@angular/material/form-field';
import { User } from '../../models/user';
import { MatTable, MatTableModule } from '@angular/material/table';
import { UserServiceService } from '../../services/user-service.service';
import { GroupService } from '../../services/group.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-group-create-page',
  standalone: true,
  imports: [    
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule

  ],
  templateUrl: './group-create-page.component.html',
  styleUrl: './group-create-page.component.css'
})
export class GroupCreatePageComponent {

  newGroup : CreateGroupDto = {name : '', userIds: []}
  newGroupForm : FormGroup
  selectedUserIds : string[] = []
  allUsers : User[] = []
  filteredUsers : User[] = []
  availableUsers : Observable<User[]>
  selectedUsers : User[] = []
  userSelectControl  = new FormControl<string | User> ('')
  isLoaded : boolean = false

  @ViewChild(MatTable) table! : MatTable<any>


  displayedColumns: string[] = ['id', 'userName', 'email', 'deleteButton'];
  

  constructor(private fb : FormBuilder, private userService : UserServiceService, private groupService : GroupService) {

    userService.getAllUsers().subscribe({
      next:(data) =>  {
        this.allUsers = data;
      },
      error: (error) => {
        console.error('Error pulling all users', error)
      },
      complete: () => {
        console.log('User pull complete.')
        console.log(this.allUsers)
        this.isLoaded = true
      }
    })

    this.newGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    })
    
    this.filteredUsers = this.allUsers.filter(x => !this.selectedUsers.includes(x))
    
    this.availableUsers = this.userSelectControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const email = typeof value === 'string' ? value : value?.email;
        return email ? this._filter(email as string) : this.allUsers.slice();
      }),
    );
  }

  

  addUser(user : User) {
    if(this.selectedUsers.find(x => x === user))
    {
      console.error("Unable to add user: User already exists in selection.")
    }
    else
    {
      this.selectedUsers.push(user)
      this.table.renderRows()
      this.userSelectControl.reset()
    }
    }

  //need to change to select users once add user is working correctly
  deleteUserFromTable(user : User) {
    var index = this.selectedUsers.indexOf(user, 0)
    console.log(index)
    console.log('splicing user')
    this.selectedUsers.splice(index,1)
    console.log(this.allUsers)
    this.table.renderRows()
  }

  onSubmit() {
    this.selectedUsers.forEach(x => {this.selectedUserIds.push(x.id.toString())})

    if (this.newGroupForm.valid && this.selectedUserIds.length > 9)
    {
      this.newGroup.name = this.newGroupForm.controls['name'].value
      this.newGroup.userIds = this.selectedUserIds
      this.groupService.createGroup(this.newGroup).subscribe({
        next:(data) =>  {
          console.log(data)
        },
        error: (error) => {
          console.error('Error creating group: ', error)
        },
        complete: () => {
          console.log('Successfully created group.')
        }
      })
      console.log(this.newGroup)
    }
  }

  private _filter(email: string): User[] {
    const filterValue = email.toLowerCase();
    this.filteredUsers = this.allUsers.filter(x => !this.selectedUsers.includes(x))
    return this.filteredUsers.filter(user => user.email.toLowerCase().includes(filterValue));
  }

  displayFn(user: User): string {
    return user && user.email ? user.email : '';
  }

}
