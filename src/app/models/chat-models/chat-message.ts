export interface ChatMessage {
    id : number
    chatId : number
    originalMessage : string
    filteredMessage : string | null
}
