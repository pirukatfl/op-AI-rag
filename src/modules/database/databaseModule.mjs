import query from './../../../infra/database.mjs'

class DatabaseModule {
  async insertIntoBank(data) {
    return ''
  }

  async validateIfDatabaseExists(databaseName) {
    if (!databaseName) {
      throw new Error('Informe o nome do database')
    }
    
    console.log('databaseName', databaseName)

    const dbExistsQuery = `SELECT 1 AS count FROM pg_database WHERE datname = $1`
    console.log('DBEXISTSQUERY', dbExistsQuery)
    const result = await query(dbExistsQuery, [databaseName])

    return result.rowCount > 0
  }

  async createTableIfNotExists(queryString) {
    const res = await query(queryString)
    console.log('RES', res)
    return res
  }

  async insertOnTable(tableName, data) {
    try {
      const keysToAdd = Object.keys(data);
      const columns = keysToAdd.join(', ');
      const valuesToAdd = Object.values(data);
      
      // Cria os placeholders: $1, $2, $3, ...
      const placeholders = keysToAdd.map((_, index) => `$${index + 1}`).join(', ');
      
      const queryText = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      
      console.log('Query Text:', queryText);
      console.log('Values to Bind:', valuesToAdd);

      // Passa a query e o array de valores para a função 'query'
      const res = await query(queryText, valuesToAdd);
      
      console.log('RES', res);
      return res;
    } catch (error) {
      // O PostgreSQL agora cuida da formatação correta dos valores (strings, números, etc.)
      console.log('error', error);
      throw error; // É bom relançar o erro para que o caller saiba que falhou
    }
  }
}

export default DatabaseModule