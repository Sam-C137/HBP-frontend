export type Contact = {
    conversationId: string;
    patientsName: string;
    patientsId: string;
    doctorsName: string;
    doctorsId: string;
    lastChat: Message;
    newMessages: boolean;
    messages: Map<string, Message[]>;
    doctorPic: string;
    patientPic: string;
    loading?: boolean;
};

export interface Message extends Chat {
    chatId: string;
    senderFullName: string;
    recipientFullName: string;
    timeStamp: string;
    receipt: boolean;
}

export type Chat = {
    conversationId: string;
    senderId: string;
    recipientId: string;
    content: string;
};

export type HistoryPayload = {
    conversationId: string;
    userId: string;
};
