import { Injectable } from '@angular/core';
import { Chat } from '../models/chat/chat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable({
  providedIn: 'root'
})

export class DateService {

  convertUTCDateToLocalDate(date: Date) : string {
    return dayjs(date).utc().local().format('M/D/YYYY, h:mm A'); 
  }

  isChatClosed(chat: Chat) : boolean {
    const closeDate = dayjs.utc(chat.createdOn).add(24, 'hours');
    const currentDate = dayjs.utc();
    return closeDate.isBefore(currentDate);
  }
}
