import http from 'node:http'
import { convertToJSON } from './middlewares/convertBuffer.js'
import { routes } from './routes.js'
import { validationReq } from './middlewares/validationReq.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
    const { method, url} = req

    await convertToJSON(req, res)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    try {
        validationReq(req, res)
    } catch (error) {
        return res.writeHead(500).end()
    }

    try {
        if(route){
            const routeParams = req.url.match(route.path)
            
            const { query, ...params } = routeParams.groups

            req.query = query ? extractQueryParams(query) : {}
            req.params = params

            return route.handler(req, res)
        }
    } catch (error) {
        return res.writeHead(500).end(JSON.stringify(error.message))
    }             

    return res.writeHead(404).end()
})

server.listen(3333, ()  => {
    console.log('listening on 3333')
})