import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextFilterService {

  private http : HttpClient;
  private url : string = "https://www.purgomalum.com/service/json?text="

  //need to use backend construction to avoid the interceptor adding extra headers
  constructor(handler : HttpBackend)
  {
    this.http = new HttpClient(handler); 
  }

  filterChatmessage(message : string) : Observable<string> {
    return this.http.get<string>(this.url+message)
  }
}
