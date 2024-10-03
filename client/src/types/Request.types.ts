export interface IncomingRequestProps {
    _id: string;
    receiver: string;
    sender: {
        _id: string;
        username: string;
    };
    status: string;
}
export interface OutgoingRequestProps {
    _id: string;
    sender: string;
    receiver: {
        _id: string;
        username: string;
    };
    status: string;
}