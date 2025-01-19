const {createHmac, randomBytes}=require('crypto')
const mongoose=require('mongoose');
const { createtoken } = require('../services/authentication');

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER"
    }
},{timestamps:true})

userSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified('password')) return;
    const salt=randomBytes(15).toString();

    const hashPassword=createHmac('sha256',salt).update(user.password).digest('hex')

    this.salt=salt;
    this.password=hashPassword;

    return next();

})

userSchema.static("passwordcheckerandauthentication",async function(email,password ){
    const user=await this.findOne({email});
    if(!user) throw new Error('Not able to find account on this email');

    const salt=user.salt;
    const userpass=user.password;

    const givenpassword=createHmac('sha256',salt).update(password).digest('hex')

    if(userpass !== givenpassword)  throw new Error("Incorrect Password")
    
    const token=createtoken(user)
    return token;
})

const userModel=mongoose.model('users',userSchema);


module.exports=userModel;