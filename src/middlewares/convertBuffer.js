export async function convertToJSON(req, res){
    const buffers = []
    for await (const chunk of req){
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
        return 
    } catch (error) {
        req.body = null
    }
}