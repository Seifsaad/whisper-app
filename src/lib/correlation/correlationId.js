import crypto from "node:crypto";
export function correlationId(req,res,next){
    const id = crypto.randomUUID();
    req.correlationId=id;
    res.setHeader('x-correlationId',id)
    next()
}