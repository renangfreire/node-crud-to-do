export function validationReq(req, res){
    const {method} = req

    if(method === "POST"){
        if(!req.body){
            throw new Error
        }
    }
}