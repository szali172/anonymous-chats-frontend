export interface CreateMessageDto {
    chatId : number
    originalMessage : string
    filteredMessage : string | null
}
