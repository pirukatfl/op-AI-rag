import { convert } from "html-to-text"
import DatabaseModule from "../database/databaseModule.mjs"

class HelpCenterController {

    constructor(instanceAxios) {
        this.axios = instanceAxios
        this.dbName = 'op_rag'
        this.tableName = 'articles'
        this.tableQuery = `
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                html_url VARCHAR(255),
                name VARCHAR(150),
                title VARCHAR(150),
                body TEXT
            );
        `

        if (!this.axios) {
            throw new Error('injete uma instancia axios configurada com a baseURL necessária')
        }
    }

    async getAllArticles(req, res) {
        try {
            const databaseModule = new DatabaseModule()

            const hasDatabase = await databaseModule.validateIfDatabaseExists(this.dbName)
            console.log('HASDATABASE', hasDatabase)

            if (!hasDatabase) {
                return 'sem database'
            }

            const teste = await databaseModule.createTableIfNotExists(this.tableQuery)
            console.log('TESTE', teste)

            const initialUrl = 'pt-br/articles'
            let nextUrl = initialUrl + '.json?page[size]=100'
            let arr = []
            let count = 0
            while (nextUrl) {
                console.log('NEXTURL', nextUrl)
                const { data } = await this.axios.get(nextUrl)
                arr.push(data.articles.map((article) => {
                    return {
                        html_url: article.html_url,
                        name: article.name,
                        title: article.title,
                        body: convert(article.body, {
                            wordwrap: 110,
                        }),
                    }
                }))
                count += data.articles.length
                if (data.meta.has_more) {
                    const nextPage = data.links.next.split("center/")[1]
                    nextUrl = nextPage
                    console.log('SETOU A NOVA URL', nextPage)
                } else {
                    nextUrl = ''
                }
            }

            const result = arr[0]
            result.forEach(element => {
                databaseModule.insertOnTable(this.tableName, element)
            });
            res.status(200).json(result);
        } catch (error) {
            console.log('ERROR', error) 
        }
    }
}

export default HelpCenterController