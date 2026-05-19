const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    id:{
        type:String
    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:[String],
        required:true
    },
    archived:{
        type:Boolean,
        default:false
    },
    deleted:{
        type:Boolean,
        default:false
    },
}, {timestamps: true})

const noteModel = mongoose.model("Note", noteSchema)
module.exports = noteModel

