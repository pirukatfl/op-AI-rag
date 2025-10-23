import query from './../../../infra/database.mjs'

class DatabaseModule {
  async insertIntoBank(data) {
    return ''
  }

  async validateIfDatabaseExists(databaseName) {
    if (!databaseName) {
      throw new Error('Informe o nome do database')
    }
    
    const dbExistsQuery = `SELECT 1 AS count FROM pg_database WHERE datname = $1`
    const result = await query(dbExistsQuery, [databaseName])

    return result.rowCount > 0
  }

  async createTableIfNotExists(queryString) {
    const res = await query(queryString)
    return res
  }

  async insertOnTable(tableName, data) {
    try {
      const keysToAdd = Object.keys(data);
      const columns = keysToAdd.join(', ');
      const valuesToAdd = Object.values(data);
      
      const placeholders = keysToAdd.map((_, index) => `$${index + 1}`).join(', ');
      
      const queryText = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      
      const res = await query(queryText, valuesToAdd);
      
      return res;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}

export default DatabaseModule