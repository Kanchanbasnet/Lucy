import { DatabaseConfig } from "@repo/types";
import { getDatabaseConfig } from "./database.config";
import { Pool, QueryResult } from "pg";


export class DatabaseService {
    private pool: Pool;
    private config: DatabaseConfig;

    constructor(config?: DatabaseConfig) {
        this.config = config || getDatabaseConfig();
        this.pool = new Pool(this.config);

        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
        });
    }
    async connect() {
        try {
            await this.pool.connect();
            console.log(`Connected to the database ${this.config.database}successfully`)

        } catch (error) {
            console.error(`Error connecting to the database ${this.config.database}`, error)


        }
    }

    async close() {
        await this.pool.end();
        console.log("Database connection closed");
    }

    async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
        const start = Date.now();
        try {
            const result = await this.pool.query<T>(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text, duration, rows: result.rowCount });
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }


}