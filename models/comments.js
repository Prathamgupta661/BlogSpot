const {Schema,model}=require('mongoose');

const commentSchema=new Schema({
    comment:{
        type:String
    },
    createdby:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    blogid:{
        type:Schema.Types.ObjectId,
        ref:'Blog-data'
    }

})

const comment=model('comments',commentSchema);

module.exports=comment