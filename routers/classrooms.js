const router = require('express').Router();
const  mongoose = require('mongoose');
const autoris = require('../middlewars/autoris');
const { ClassRoom } = require('../models/classroom');

router.post('/',autoris,async (req, res) =>{
    let classRoom = new ClassRoom(req.body);
    try {
        classRoom = await classRoom.save();
    } catch (error) {
        return res.status(400).send(error.message);
    }
    
    res.status(201).send(classRoom);
})

router.get('/',async (req, res) =>{
    let classrooms = await ClassRoom.find();
    res.status(200).send(classrooms);
})

router.get('/id/:id',async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')
    let classroom = await ClassRoom.findById(req.params.id);
    if(!classroom)
        return res.status(404).send('Classroom is not found')
    res.status(200).send(classroom);
})

module.exports=router;