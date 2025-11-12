
export type UserResponse = {
    id: string;
    email: string;
    name: string;
    phoneNumber: string | null;
    verified: boolean;
    verificationToken?: string,
    verificationTokenExpiry?: Date
};