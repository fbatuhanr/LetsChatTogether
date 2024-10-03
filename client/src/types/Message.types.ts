export interface MessageProps {
    _id: string;
    
    text: string;
    date: Date | null;

    senderId: string;
    receiverId: string | null;

    createdAt?: Date;
}