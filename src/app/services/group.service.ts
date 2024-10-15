import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Group } from '../models/group/group';
import { User } from '../models/user';
import { CreateGroupDto } from '../models/group/create-group-dto';
import { UpdateGroupDto } from '../models/group/update-group-dto';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private location = "Group"

  constructor(private httpClient : HttpClient) { }

  getGroup(id : number): Observable<Group>{
    return this.httpClient.get<Group>(`${environment.apiUrl}/${this.location}/${id}`)
  }

  getUserGroups(userId : string): Observable<Group[]>{
    return this.httpClient.get<Group[]>(`${environment.apiUrl}/${this.location}/GetUserGroups/${userId}`)
  }

  getGroupUsers(id : number): Observable<User[]>{
    return this.httpClient.get<User[]>(`${environment.apiUrl}/${this.location}/GetGroupUsers/${id}`)
  }

  createGroup(createGroupDto : CreateGroupDto): Observable<CreateGroupDto>{
    return this.httpClient.post<CreateGroupDto>(`${environment.apiUrl}/${this.location}`, createGroupDto)
  }

  updateGroup(id: number, updateGroupDto : UpdateGroupDto): Observable<UpdateGroupDto>{
    return this.httpClient.put<UpdateGroupDto>(`${environment.apiUrl}/${this.location}/${id}`, updateGroupDto)
  }

  deleteGroup(id : number): Observable<void>{
    return this.httpClient.delete<void>(`${environment.apiUrl}/${this.location}/${id}`)
  }
}
