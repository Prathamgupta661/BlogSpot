require('dotenv').config();
const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser');
const { checkAuth } = require('./middleware/authentication');

const userRouter=require('./routes/user');
const BlogRouter=require('./routes/blog');
const Blog = require('./models/blog');

const app=express();

mongoose.connect(process.env.MONGODB_URL).then(e=>console.log("mongodb is connected"));

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('./public')));
app.use(cookieParser())
app.use(checkAuth('token'))

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

app.use("/user",userRouter)
app.use("/blog",BlogRouter)

app.get('/',async(req,res)=>{
    const allblogs=await Blog.find({})
    res.render('home',{user:req.user,
        blogs:allblogs
    })
})



app.listen(process.env.PORT || 3000 ,()=>console.log(`Server Started at port:${process.env.PORT}`));