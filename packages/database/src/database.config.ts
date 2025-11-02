import {DatabaseConfig} from '@repo/types';

export function getDatabaseConfig(): DatabaseConfig {
    return {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD

    }

}