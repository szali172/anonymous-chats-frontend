import { User } from "../user";
import { Chat } from "./chat";
import { ChatMessage } from "./chat-message";
import { ChatUser } from "./chat-user";

export interface CompleteChat {
    chat : Chat
    chatUsers : ChatUser[]
    chatMessages : ChatMessage[]
}
