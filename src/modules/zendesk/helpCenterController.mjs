import { convert } from "html-to-text"


class HelpCenterController {

    constructor(instanceAxios) {
        this.axios = instanceAxios
    }

    async getAllArticles(req, res) {
        const initialUrl = 'pt-br/articles'
        let nextUrl = initialUrl + '.json?page[size]=100'
        let arr = []
        let count = 0
        while (nextUrl) {
            console.log('NEXTURL', nextUrl)
            const { data } = await this.axios.get(nextUrl)
            arr.push(data.articles.map((article) => {
                return {
                    id: article.id,
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
        res.status(200).json(...arr);
    }
}

export default HelpCenterController