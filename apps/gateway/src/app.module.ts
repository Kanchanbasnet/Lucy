import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {AppController} from './app.controller'
import { AppService } from "./app.service";
import { HttpModule } from "@nestjs/axios";
import { ChatModule } from './chat/chat.module';


@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 4001
                }
            }, 
        ]),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5
        }),
        ChatModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}