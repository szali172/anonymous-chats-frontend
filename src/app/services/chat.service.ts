import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Chat } from '../models/chat/chat';
import { environment } from '../../environments/environment';
import { ChatUser } from '../models/chat/chat-user';
import { ChatMessage } from '../models/chat/chat-message';
import { ChatGuess } from '../models/chat/chat-guess';
import { CreateMessageDto } from '../models/chat/create-message-dto';
import { ChatGuessDTO } from '../models/chat/chat-guess-dto';
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  location = "Chat"
  private hubConnection: signalR.HubConnection;
  private messagesSubject = new Subject<ChatMessage>();

  constructor(private httpClient :HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.webSocket}`)
    .build();

    // Listen for incoming messages
    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      this.messagesSubject.next(message);
    });
  }

  // Start the SignalR connection
  public startConnection(): Promise<void> {
    return this.hubConnection.start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  // Join a specific chat group by ChatId
  public joinChatGroup(chatId: number): Promise<void> {
    return this.hubConnection.invoke('JoinChatGroup', chatId)
      .then(() => console.log(`Joined chat group ${chatId}`))
      .catch(err => console.error('Error while joining chat group: ', err));
  } 

  // Observable for incoming messages
  public onMessageReceived(): Observable<ChatMessage> {
    return this.messagesSubject.asObservable();
  }


  // Backend endpoints
  getUserChats(userId : string, groupId : number): Observable<Chat[]>{
    return this.httpClient.get<Chat[]>(`${environment.apiUrl}/${this.location}/Chats/userId=${userId}/groupId=${groupId}`)
  }

  getChatUsers(chatId : number): Observable<ChatUser[]>{
    return this.httpClient.get<ChatUser[]>(`${environment.apiUrl}/${this.location}/Users/${chatId}`)
  }

  getChatMessages(chatId : number):Observable<ChatMessage[]>{
    return this.httpClient.get<ChatMessage[]>(`${environment.apiUrl}/${this.location}/Messages/${chatId}`)
  }

  getUserGuesses(chatId : number,userId : string): Observable<ChatGuess[]>{
    return this.httpClient.get<ChatGuess[]>(`${environment.apiUrl}/${this.location}/Guesses/chatId=${chatId}/guesserId=${userId}`)
  }

  updateUserGuess(userGuessDto : ChatGuessDTO): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/${this.location}/Guesses`, userGuessDto)
  }

  createChats(groupId: number): Observable<Chat[]> {
    return this.httpClient.post<Chat[]>(`${environment.apiUrl}/${this.location}/Chats/groupId=${groupId}`, null)
  } 

  // Message will be written to the database and broadcasted to all other chatGroup members
  createChatMessage(messageDto : CreateMessageDto): Observable<ChatMessage> {
    return this.httpClient.post<ChatMessage>(`${environment.apiUrl}/${this.location}/Messages`, messageDto)
  }
}
