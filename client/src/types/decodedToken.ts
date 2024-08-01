export interface DecodedToken {
    userId: string; // or mongoose.Types.ObjectId
    username: string;
    exp?: number;
    iat?: number;
  }