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
    console.log('DATA', data)
    const keysToAdd = Object.keys(data)
    const columns = keysToAdd.join(', ')
    const valuesToAdd = Object.values(data)
    const values = valuesToAdd.join(", ")
    console.log('Values', values)
    console.log(keysToAdd.join(", "))
    console.log(`INSERT INTO ${tableName} (${columns}) values (${values})`)
    const res = await query(`INSERT INTO ${tableName} (${columns}) values (${values})`)
    console.log('RES', res)
    return res
  }
}

export default DatabaseModule