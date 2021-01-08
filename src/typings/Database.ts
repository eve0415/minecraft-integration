export interface DBserver {
    ID: number
    type: string
    name?: string
}

export interface DBstatus {
    channelID: string
    messageID: string
}

export interface DBdata {
    channelID: string
    serverID: number
}
