import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@repo/db';
import { CreateUserDto, UpdateUserDto, UserResponse } from '@repo/types';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
        try {
            const userExist = await this.findUserByEmail(createUserDto.email);
            if (userExist) {
                throw new ConflictException('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    password: hashedPassword,
                    name: createUserDto.name,
                    phoneNumber: createUserDto.phoneNumber
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                },
            });
            return user;
        } catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }
    async findUserWithPasswordByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return user;

    }

    async findUserByEmail(email: string): Promise<UserResponse | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
            },
        });
        return user;
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
            },
        });
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
        try {
            const existingUser = await this.findUserById(id);

            if (!existingUser) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    ...(updateUserDto.email && { email: updateUserDto.email }),
                    ...(updateUserDto.password && { password: await bcrypt.hash(updateUserDto.password, 10) }),
                    ...(updateUserDto.name && { name: updateUserDto.name }),
                    ...(updateUserDto.phoneNumber !== undefined && {
                        phoneNumber: updateUserDto.phoneNumber,
                    }),
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                },
            });
            return user;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        try {
            const user = await this.findUserById(id);
            if (!user) {
                throw new NotFoundException('User not Found.');
            }
            await this.prisma.user.delete({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                },
            });

            return {
                message: 'User deleted successfully'
            };
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }

    }
}
