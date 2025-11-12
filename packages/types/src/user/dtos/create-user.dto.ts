export interface CreateUserDto {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
    verificationToken?: string,
    verificationTokenExpiry?: Date
    
}