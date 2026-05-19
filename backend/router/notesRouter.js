const express = require('express')
const noteModel = require('../models/notes')
const notesRouter = express.Router()
const Allowed_Fields = [""]

notesRouter.get('/notes/list', async(req,res)=>{
    try{
        const data = await noteModel.find().sort({ createdAt: -1 })
        res.json({message:'Notes Data fetched successfully', data : data})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

notesRouter.get('/note/:id', async(req,res)=>{
    try{
        const noteId = req.params.id
        const data = await noteModel.findById(noteId)
        res.json({message:'note fetched', data : data})
    }catch(err){

    }
})



notesRouter.post('/add/notes', async (req, res) => {
    try {
        const data = req.body

        // Find last inserted note
        const lastNote = await noteModel.findOne().sort({ id: -1 })

        // Auto increment id
        const newId = lastNote ? lastNote.id + 1 : 1

        // Convert content string into array
        const contentArray = data.content
            .split(',')
            .map(item => item.trim())

        const notes = new noteModel({
            id: newId,
            title: data.title,
            content: contentArray,
            archived: data.archived,
            deleted: data.deleted
        })

        await notes.save()

        res.status(201).json({
            message: "Note added successfully",
            data: notes
        })

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = notesRouter