import http from 'node:http'
import { convertToJSON } from './middlewares/convertBuffer.js'
import { routes } from './routes.js'
import { validationReq } from './middlewares/validationReq.js'

const server = http.createServer(async (req, res) => {
    const { method, url} = req

    await convertToJSON(req, res)

    const route = routes.find(route => {
        return route.path === url && route.method === method
    })

    try {
        validationReq(req, res)
    } catch (error) {
        return res.writeHead(500).end()
    }

    try {
        if(route){
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