import { CreateUserDto } from "../dtos/create-user.dto";

export interface User extends CreateUserDto {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}