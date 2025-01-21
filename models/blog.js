const {Schema,model}=require('mongoose')

const BlogSchema=new Schema({

    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    ImagePathUrl:{
        type:String,
    },
    cloudinaryPublicId:{
        type:String

    },
    CreatedBy:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
},{timestamps:true})

const Blog=model('Blog-data',BlogSchema);

module.exports=Blog;