import { SqliteDatabaseManager } from './database_manager';
import type { DatabaseManager } from './types';

export const database: DatabaseManager = new SqliteDatabaseManager();
