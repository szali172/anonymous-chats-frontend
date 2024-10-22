import { Injectable } from '@angular/core';
import { Chat } from '../models/chat/chat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { ChatMessage } from '../models/chat/chat-message';
import { CompleteChat } from '../models/chat/complete-chat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

@Injectable({
  providedIn: 'root'
})

export class DateService {

  convertUTCDateToLocalDate(date: Date) : string {
    return dayjs(date).utc().local().format('M/D/YYYY, h:mm A'); 
  }

  
  sortCompleteChatsByDate(chats: CompleteChat[]) : CompleteChat[] {
    return chats.sort((a, b) => new Date(b.chat.createdOn).getTime() - new Date(a.chat.createdOn).getTime());
  }

  
  sortMessagesByDate(messages: ChatMessage[]): ChatMessage[] {
    return messages.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
  }


  isChatClosed(chat: Chat | undefined) : boolean {
    if (!chat) {
      console.error('passed in chatObject was undefined');
      return false;
    }

    const closeDate = dayjs.utc(chat.createdOn).add(24, 'hours');
    const currentDate = dayjs.utc();
    return closeDate.isBefore(currentDate);
  }

  
  getRemainingTime(chat: Chat | undefined): string {
    if (!chat) {
      console.error('passed in chatObject was undefined');
      return '';
    }

    const closeDate = dayjs.utc(chat.createdOn).add(24, 'hours');
    const currentDate = dayjs.utc();
    const diff = closeDate.diff(currentDate); // Difference in milliseconds

    if (diff <= 0) {
      return 'Closed';
    }

    const remainingDuration = dayjs.duration(diff);
    const hours = remainingDuration.hours();
    const minutes = remainingDuration.minutes();
    const seconds = remainingDuration.seconds();

    return `${hours}h ${minutes}m ${seconds}s`;
  }


  isTimeBelowTenMinutes(chat: Chat | undefined): boolean {
    if (!chat) {
      console.error('passed in chatObject was undefined');
      return false;
    }

    const closeDate = dayjs.utc(chat.createdOn).add(24, 'hours');
    const currentDate = dayjs.utc();
    const diff = closeDate.diff(currentDate, 'minutes');
    return diff < 10;
  }
}
