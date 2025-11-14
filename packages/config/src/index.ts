import { Module } from "@nestjs/common";
import {ConfigModule as NestConfigModule} from '@nestjs/config';


@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
            expandVariables: true,
        })
    ],
    exports: [NestConfigModule],
})
export class ConfigModule{}

export {ConfigService} from '@nestjs/config'