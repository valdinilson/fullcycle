import mysql, { ConnectionOptions, OkPacket, Pool, PoolConnection, QueryResult, ResultSetHeader } from 'mysql2/promise';

export class Repository<T> {
  private pool: Pool;

  constructor(config: ConnectionOptions) {
    this.pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  /**
   * Manages database connections automatically and executes the provided callback
   * @param callback - Function that receives a connection and executes a query
   */
  private async withConnection<R>(callback: (connection: PoolConnection) => Promise<R>): Promise<R> {
    const connection = await this.pool.getConnection();
    try {
      return await callback(connection);
    } catch (error) {
      console.error('Error executing query: ', error);
      throw error;
    } finally {
      connection.release(); // Ensures the connection is released back to the pool
    }
  }

  /**
   * Executes INSERT, UPDATE, or DELETE commands
   * @param sql - SQL query
   * @param values - Query values
   * @returns A ResultSetHeader object
   */
  public async execute(sql: string, values: any[]): Promise<ResultSetHeader> {
    return this.withConnection(async (connection) => {
      const [result] = await connection.execute<ResultSetHeader>(sql, values);
      return result;
    });
  }


  /**
   * Executes SELECT queries
   * @param sql - SQL query
   * @param values - Optional query parameters
   * @returns An array of typed results
   */
  public async query(sql: string, values?: any[]): Promise<T[]> {
    return this.withConnection(async (connection) => {
      const [rows] = await connection.query(sql, values);
      return rows as T[];
    });
  }

  /**
   * Executes a transaction, ensuring atomicity
   * @param callback - Asynchronous function that executes operations within the transaction
   * @returns The return value of the callback function
   */
  public async executeWithTransaction<R>(callback: (connection: PoolConnection) => Promise<R>): Promise<R> {
    return this.withConnection(async (connection) => {
      await connection.beginTransaction();
      try {
        const result = await callback(connection);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error('Error during transaction: ', error);
        throw error;
      }
    });
  }

}
