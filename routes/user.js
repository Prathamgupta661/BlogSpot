const {Router}=require('express');
const userModel = require('../models/user');

const router=Router();


router.get("/signup",(req,res)=>{
    res.render('signup');
})
router.get("/login",(req,res)=>{
    res.render('login');
})

router.post("/signup",async(req,res)=>{
    try {
        const {fullName,email,password}=req.body;
    await userModel.create({
        fullName,
        email:email.toLowerCase(),
        password
    })
    return res.redirect('/user/login')
    } catch (error) {
        res.render('signup',{error:error})
    }
    
})

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    try {
        const token=await userModel.passwordcheckerandauthentication(email.toLowerCase(),password)

        res.cookie('token',token).redirect('/')
    } catch (error) {
        res.render('login',{error:error})
    }
    
})

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports=router;