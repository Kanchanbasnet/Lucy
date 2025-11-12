export interface SocialAuthDto {
    provider: 'google' | 'microsoft' | 'apple';
    providerId: string;
    email: string;
    name: string;
    avatar?: string;

}