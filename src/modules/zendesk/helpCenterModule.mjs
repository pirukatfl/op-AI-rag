import { convert } from "html-to-text"
import DatabaseModule from "../database/databaseModule.mjs"
import dotenv from 'dotenv'

dotenv.config()

class HelpCenterController {

    constructor(instanceAxios) {
        this.axios = instanceAxios
        this.dbName = 'op_rag'
        this.tableName = 'articles'
        this.tableQuery = `
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                html_url VARCHAR(255),
                name VARCHAR(255),
                title VARCHAR(255),
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

            if (!hasDatabase) {
                return 'sem database'
            }

            const teste = await databaseModule.createTableIfNotExists(this.tableQuery)

            const initialUrl = 'pt-br/articles'
            let nextUrl = initialUrl + '.json?page[size]=100'
            let arr = []
            let count = 0
            while (nextUrl) {
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
                if (data.meta && data.meta.has_more) {
                    // data.links.next virá completo: 'https://operandsupport.zendesk.com/api/v2/help_center/pt-br/articles.json?page[after]=...'
                    
                    // Remove a baseURL da URL completa para obter o caminho relativo
                    const nextFullUrl = data.links.next;
                    
                    // 1. Remove a baseURL do Zendesk para obter o caminho relativo (ex: 'pt-br/articles.json?page[after]=...')
                    // Nota: A baseURL termina com um '/', que facilita a substituição
                    nextUrl = nextFullUrl.replace(process.env.BASE_URL_ZENDESK, '');
                    
                } else {
                    nextUrl = null // Termina o loop
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