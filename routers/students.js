const router = require('express').Router();
const  mongoose = require('mongoose');
const {Student} = require('../models/student');
const _ = require('lodash');
const { ClassRoom } = require('../models/classroom');
const auth = require('../middlewars/auth');
const autoris = require('../middlewars/autoris');

router.post('/',auth,async (req, res) =>{
    let student = new Student(req.body);
    let validation_res = student.validate_body(req.body);
    if(validation_res.error)
        return res.status(400).send(validation_res.error.message);
    const classRoom = await ClassRoom.findById(req.body.classRoomId);
    if(!classRoom)
        return res.status(400).send('ClassRoom id not found in DB')
    student.classRoom = {
        id : classRoom._id,
        name : classRoom.name
    }
    classRoom.student_number++;
    try {
        student = await student.save();
        await classRoom.save()
    } catch (error) {
        return res.status(400).send(error.message);
    }
    
    res.status(201).send(student);
})

router.get('/',async (req, res) =>{
    let students = await Student.find();
    res.status(200).send(students);
})

router.get('/id/:id',async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')
    let student = await Student.findById(req.params.id)
                            .populate('classRoom.id');
    if(!student)
        return res.status(404).send('Student is not found')
    res.status(200).send(student);
})
// search via active = true
router.get('/active',async (req, res) =>{
    let students = await Student.find({active:'true'});
    res.status(200).send(students);
})
// search via active = false
router.get('/not/active/size/:size/page/:page',async (req, res) =>{
    let students = await Student.find({active:'false'})
                                .skip((req.params.page-1)*req.params.size)
                                .limit(req.params.size);
                                
    res.status(200).send(students);
})
// search via age between two limits
//operators $eq $neq $in $nin $gt $gte $lt $lte
router.get('/age/min/:min/max/:max',async (req, res) =>{
    let students = await Student.find({age:{$gte : req.params.min, $lt : req.params.max}});
    res.status(200).setHeader('elements-number',students.length).send(students);
});

router.delete('/id/:id',[auth,autoris],async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')
    let student = await Student.findByIdAndRemove(req.params.id);
    if(!student)
        return res.status(404).send('Student is not found')
    res.status(200).send(student);
})

router.put('/id/:id',async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')
    let student = await Student.findById(req.params.id);
    if(!student)
        return res.status(404).send('Student is not found')
    student = _.merge(student,req.body);
    await student.save();
    res.status(200).send(student);
})

module.exports=router;