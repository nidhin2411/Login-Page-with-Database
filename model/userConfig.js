const  mongoose= require('mongoose')



// Create a schema
const LoginSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    email : {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:'user'
    },
});

// Collection Part
const collection= new mongoose.model("users",LoginSchema);

module.exports= collection;



