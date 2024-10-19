export interface UserGuess {
    id : number
    chatId : number
    guesserId : string //who is making the guess
    guesseeId : string | null //who they think it is
    actualId : string //who it actually is
    createdOn : Date
}
