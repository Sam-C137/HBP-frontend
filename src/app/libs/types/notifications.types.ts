export type Notification = {
    id: number;
    senderId: string;
    senderName: string;
    recipient: string;
    content: string;
    context: string;
    profilePicture: string;
    receipt: boolean;
    timeStamp: string;
    type: "BOOK" | "REVIEW" | "ACCOUNT" | "CLEAR";
};
