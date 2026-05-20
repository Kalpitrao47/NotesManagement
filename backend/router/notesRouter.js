const express = require('express')
const noteModel = require('../models/notes')
const notesRouter = express.Router()
const Allowed_Fields = ["id","title","content","archived","deleted"]

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
        const isAllowedFields = Object.keys(data).every(field => Allowed_Fields.includes(field))
        if(!isAllowedFields){
            res.status(404).json({message:'Invalid Edit Request'})
        }
        // Find last inserted note
        const lastNote = await noteModel.findOne().sort({ id: -1 })

        // Auto increment id
        const newId = lastNote ? Number(lastNote.id) + 1 : 1

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

notesRouter.put('/update/notes/:id', async(req,res)=>{
    try{    
        const noteId = req.params.id
        const data = req.body
        const isAllowedFields = Object.keys(data).every(field => Allowed_Fields.includes(field))
        if(!isAllowedFields){
            res.status(404).json({message:'Invalid Edit Request'})
        }
        const note = await noteModel.findByIdAndUpdate(noteId, data, {new : true})
        if(!note){
            res.status(404).json({message:'Note not found'})
        }
        res.json({message:'Note updated successfully !', data : note})

    }catch(err){
        res.status(400).json({message:err.message})
    }
})



notesRouter.delete('/delete/notes/:id', async(req,res)=>{
    try{
        const noteId = req.params.id
        const note = await noteModel.findByIdAndDelete(noteId)
        if(!note){
            res.status(404).json({message:'Note not found'})
        }
        res.json({message:'note deleted successfully !'})

    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = notesRouter