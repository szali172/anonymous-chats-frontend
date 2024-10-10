import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../models/chat-models/chat';
import { environment } from '../../Environment/environment';
import { ChatUser } from '../models/chat-models/chat-user';
import { ChatMessage } from '../models/chat-models/chat-message';
import { UserGuess } from '../models/chat-models/user-guess';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  location = "Chat"
  constructor(private httpClient :HttpClient) { }

  getUserChats(userId : string, chatId : number): Observable<Chat[]>{
    return this.httpClient.get<Chat[]>(`${environment.apiUrl}/${this.location}/chats/userId=${userId}/groupId=${chatId}`)
  }

  getChatUsers(chatId : number): Observable<ChatUser[]>{
    return this.httpClient.get<ChatUser[]>(`${environment.apiUrl}/${this.location}/users/${chatId}`)
  }

  getChatMessages(chatId : number):Observable<ChatMessage[]>{
    return this.httpClient.get<ChatMessage[]>(`${environment.apiUrl}/${this.location}/messages/${chatId}`)
  }

  getUserGuesses(chatId : number,userId : string): Observable<UserGuess[]>{
    return this.httpClient.get<UserGuess[]>(`${environment.apiUrl}/${this.location}/guesses/chatId=${chatId}/guesserId=${userId}`)
  }

  updateUserGuess(userGuess : UserGuess): Observable<UserGuess> {
    return this.httpClient.put<UserGuess>(`${environment.apiUrl}/${this.location}/guesses`, userGuess)
  }

  createChatMessage(message :ChatMessage): Observable<ChatMessage> {
    return this.httpClient.post<ChatMessage>(`${environment.apiUrl}/${this.location}/messages`,message)
  }
}
