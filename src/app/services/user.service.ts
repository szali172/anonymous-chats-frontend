import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private location = "/User"

  constructor(private httpClient : HttpClient) { }

  getUser(id : string): Observable<User>{
    return this.httpClient.get<User>(environment.apiUrl+this.location +`/${id}`)
  }

  getAllUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(environment.apiUrl+this.location)
  }

  updateUser(user:User):Observable<User>{
    return this.httpClient.put<User>(environment.apiUrl+this.location +`/${user.id}`,user)
  }

  CreateUser(user:User): Observable<User>{
    return this.httpClient.post<User>(environment.apiUrl+this.location, user)
  }

  deleteUser(id:string) {
    this.httpClient.delete<User>(environment.apiUrl +this.location + `/${id}` )
  }
}
