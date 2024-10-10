export interface UserGuess {
    id : number
    chatId : number
    guesserId : string
    guesseeId : string | null
    actualId : string
    createdOn : Date
}
