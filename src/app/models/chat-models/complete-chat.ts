import { User } from "../user";
import { Chat } from "./chat";
import { ChatMessage } from "./chat-message";
import { ChatUser } from "./chat-user";

export interface CompleteChat {
    chat : Chat
    //chatUserMapping : ChatDictionaryThing
    chatUsers : ChatUser[]


    //Moving to be loaded directly in the chat-window
    //chatMessages : ChatMessage[]
}
