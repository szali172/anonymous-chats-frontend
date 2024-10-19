import { Component, Input,} from '@angular/core';
import { ReactiveFormsModule, FormControl} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../models/user';
import { MatTableModule} from '@angular/material/table';
import { UserServiceService } from '../../services/user-service.service';
import { CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import { ChatService } from '../../services/chat.service';
import { UserGuess } from '../../models/chat-models/user-guess';
import { ChatUser } from '../../models/chat-models/chat-user';
import { UserGuessDTO } from '../../models/chat-models/user-guess-dto';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-user-select',
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
    DragDropModule,
    CommonModule,
    MatDialogClose
  ],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.css',
})
export class UserSelectComponent {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  availableUsers: Observable<User[]>;
  userSelectControl = new FormControl<string | User>('');
  loggedInUser: User = {
    id: '8',
    userName: 'user1',
    email: 'user1email@com.us',
  };
  userGuesses: UserGuess[] = [];
  //guesseePseudonyms : Map<string, string> = new Map <string,string>
  guesseePseudonyms: ChatUser[] = [];
  guesseeMapping: Map<UserGuess, ChatUser> = new Map<UserGuess, ChatUser>();

  @Input() currentChat: number = 3;

  /*
    TODO: When they open the window we should pull / populate / or get from parent all of the guess objects from the loggedin user for each of the chat Users
    Pass in it maybe as an array? Make open guess options for each of the passed in Chat Guess Objects.
    Make a DTO for chat guess updates, will send the ID of the chat guess + the ID of the guessee
    
  */
  selectedUsers!: User[];

  displayedColumns: string[] = ['id', 'userName', 'email', 'deleteButton'];

  constructor(
    private userService: UserServiceService,
    private chatService: ChatService
  ) {
    //spin up all users to start with
    this.getAllUsers();
    this.getUserGuesses();

    //map the filter from user input to a filter function and map to new array
    this.availableUsers = this.userSelectControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const email = typeof value === 'string' ? value : value?.email;
        return email ? this._filter(email as string) : this.allUsers.slice();
      })
    );
  }

  //actual filtering service based on user input that is being typed
  private _filter(email: string): User[] {
    const filterValue = email.toLowerCase();
    return this.filteredUsers.filter((user) =>
      user.email.toLowerCase().includes(filterValue)
    );
  }

  displayFn(user: User): string {
    return user && user.email ? user.email : '';
  }

  drop(event: CdkDragDrop<User[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      var containerUserId = parseInt(event.container.id);
      //check if there is already a selected value in the selection, if so, re-add the selection back to the main list
      if (this.selectedUsers[containerUserId].id !== '') {
        //if its not a fake user, add the container user back to the allUser array, then map the event user to the container index
        this.allUsers.push(this.selectedUsers[containerUserId]);
        this.selectedUsers[containerUserId] = event.item.data as User;
      }
      this.selectedUsers[containerUserId] = event.item.data as User;
      this.allUsers.splice(event.previousIndex, 1);
      this.allUsers.sort((a: User, b: User) =>
        a.userName.localeCompare(b.userName)
      );
    }
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
      },
      error: (error) => {
        console.error('Error pulling all users', error);
      },
      complete: () => {
        console.log('User pull complete.');
      },
    });
  }

  getUserGuesses() {
    this.chatService
      .getUserGuesses(this.currentChat, this.loggedInUser.id)
      .subscribe({
        next: (data) => {
          this.userGuesses = data;
        },
        error: (error) => {
          console.error('Error pulling all user guesses', error);
        },
        complete: () => {
          console.log('User pull complete.');
          console.log(this.userGuesses);
          this.selectedUsers = new Array(this.userGuesses.length);
          //take user guesses and use it to populate the objects needed for the frontend
          this.createGuessingArray();
          this.getUserPseuedonyms();
          //filter out already selected users and the logged in user
          //this.filteredUsers = this.allUsers.filter(x => !this.alreadySelectedUsers.includes(x) || !this.alreadySelectedUsers.includes(this.loggedInUser))
        },
      });
  }

  createGuessingArray() {
    let userIndex: number = 0;

    for (let i = 0; i < this.userGuesses.length; i++) {
      //this.userGuesses.forEach(userGuess => {
      if (this.userGuesses[i].guesseeId != null) {
        //grab the index of the user object from the
        userIndex = this.allUsers.findIndex(
          (x) => x.id === this.userGuesses[i].guesseeId
        );
        //go into all users, move the user to selected Users and remove the guessee from the avialable users
        this.selectedUsers[i] = this.allUsers[userIndex];
        this.allUsers.splice(userIndex, 1);
      } else {
        this.selectedUsers[i] = {
          id: '',
          userName: 'Make a selection',
          email: 'fakeUser@Email.com',
        };
      }
      userIndex++;
    }
    console.log(this.selectedUsers);
  }

  getUserPseuedonyms() {
    //var chatUsers : ChatUser[] = [];
    this.chatService.getChatUsers(this.currentChat).subscribe({
      next: (data) => {
        this.guesseePseudonyms = data;
        //chatUsers = data as ChatUser[]
      },
      complete: () => {
        //old code used for mapping
        // let loggedinIndex = chatUsers.findIndex(x => x.userId === this.loggedInUser.id)
        // chatUsers.splice(loggedinIndex,1)
        // chatUsers.forEach(user => {
        //   this.guesseePseudonyms.set(user.userId, user.pseudonym)
        // });

        //remove loggedin user from call
        let loggedinIndex = this.guesseePseudonyms.findIndex(
          (x) => x.userId === this.loggedInUser.id
        );
        this.guesseePseudonyms.splice(loggedinIndex, 1);
        console.log('ChatUsers: ');
        console.log(this.guesseePseudonyms);

        this.userGuesses.forEach((guess) => {
          this.guesseeMapping.set(
            guess,
            this.guesseePseudonyms.find(
              (user) => user.userId === guess.actualId
            )!
          );
        });

        console.log('Mapping: ');
        console.log(this.guesseeMapping);
      },
    });
  }

  clearSelection(index: number) {
    //check if the user exists in the container already, if so, remove it back to the main list
    if (this.selectedUsers[index].id !== '') {
      this.allUsers.push(this.selectedUsers[index]);
      this.selectedUsers[index] = {
        id: '',
        userName: 'Make a selection',
        email: 'fakeUser@Email.com',
      };
      this.allUsers.sort((a: User, b: User) =>
        a.userName.localeCompare(b.userName)
      );
    }
  }

  noReturnPredicate() {
    return false;
  }

  getMappingPseudonym(index: number): string {
    return this.guesseeMapping.get(this.userGuesses[index])!.pseudonym;
  }

  onSubmit() {
    for (let i = 0; i < this.userGuesses.length; i++) {
      this.userGuesses[i].guesseeId = this.selectedUsers[i].id;
      let updatedGuess : UserGuessDTO = {
        id: this.userGuesses[i].id,
        guesseeId: this.selectedUsers[i].id,
      }
      if (updatedGuess.guesseeId === ''){
        updatedGuess.guesseeId = null
      }
      this.chatService.updateUserGuess(updatedGuess).subscribe()
    }
    

    console.log(this.userGuesses);
  }
}
