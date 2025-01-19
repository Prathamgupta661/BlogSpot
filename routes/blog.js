const {Router}=require('express');
const path=require('path');
const multer=require('multer')
const Blog=require('../models/blog');
const comment = require('../models/comments');
const router=Router();

router.get('/',(req,res)=>{
    res.render('addblog',{user:req.user})
})

router.get('/:id',async(req,res)=>{
    const dbblog=await Blog.findById(req.params.id).populate('CreatedBy')
    const comments=await comment.find({blogid:req.params.id}).populate('createdby')
    res.render('blog',{user:req.user,blog:dbblog,comment:comments})
})

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve("./public/uploads"))
    },
    filename:function(req,file,cb){
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null,filename)
    }
})
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), async(req,res)=>{
    
    try {
        const {title,body}=req.body;
        const blog=await Blog.create({
        title,
        body,
        ImagePathUrl:`/uploads/${req.file.filename}`,
        CreatedBy:req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
        
    } catch (error) {
        res.redirect('/blog')
    }
})

router.post('/comment/:id',async(req,res)=>{
    const content=req.body.content;

    await comment.create({
        comment:content,
        createdby:req.user._id,
        blogid:req.params.id
    })
    res.redirect(`/blog/${req.params.id}`);
})




module.exports=router;

