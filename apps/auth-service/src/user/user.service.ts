import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@repo/db';
import { CreateUserDto, UpdateUserDto, UserResponse } from '@repo/types';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';



@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponse & { verificationToken: string }> {
        try {
            const userExist = await this.findUserByEmail(createUserDto.email);
            if (userExist) {
                throw new ConflictException('User with this email already exists');
            }
            const hashedPassword = 
                await bcrypt.hash(createUserDto.password, 10) 
                
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpiry = new Date();
            verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); 
            
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    password: hashedPassword,
                    name: createUserDto.name,
                    phoneNumber: createUserDto.phoneNumber,
                    verificationToken,
                    verificationTokenExpiry,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                    verified: true,
                },
            });
            return { ...user, verificationToken };
        } catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }
    async findUserWithPasswordByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                password: true,
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    verified: true,
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

    async verifyUser(token: string): Promise<UserResponse> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    verificationToken: token,
                    verificationTokenExpiry: {
                        gt: new Date(),
                    },
                },
            });

            if (!user) {
                throw new BadRequestException('Invalid or expired verification token');
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    verified: true,
                    verificationToken: null,
                    verificationTokenExpiry: null,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                    verified: true,
                },
            });

            return updatedUser;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}
