const jwt=require('jsonwebtoken');

const secret=process.env.JWT_SECRET;

function createtoken(user){
    const payload={
        _id:user._id,
        name:user.fullName,
        email:user.email,
        role:user.role
    };
    const token=jwt.sign(payload,secret);
    return token;
}

function verifytoken(token){
    const payload=jwt.verify(token,secret)
    return payload;
}

module.exports={createtoken,verifytoken};