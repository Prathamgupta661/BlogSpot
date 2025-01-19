const { verifytoken } = require("../services/authentication");

function checkAuth(cookieName){
    return (req,res,next)=>{
        const tokenVal=req.cookies[cookieName];
        if(!tokenVal) return next();

        try {
            const userPayload=verifytoken(tokenVal);
            req.user=userPayload;
        } catch (error) {}

        next()
    }
}

module.exports={checkAuth}