const express = require("express");

const router = express.Router();

const Tasks = require("../models/task");


//test
router.get("/test",(req,res)=>res.send("Tasks routes working"));

router.post("/",(req,res)=>{
    Tasks.create(req.body)
        .then(()=>res.json({msg:"Task added successfully"}))
        .catch(()=>res.status(400).json({msg:"Task adding failed"}))
});

router.get("/",(req,res)=>{
    Tasks.find()
    .then((tasks)=>res.json(tasks))
    .catch(()=>res.status(400).json({msg:"No tasks found"}));
});

router.get("/:id",(req,res)=>{
    Tasks.findById(req.params.id)
    .then((tasks)=>res.json(tasks))
    .catch(()=>res.status(400).json({msg:"cannot find this task"}))
});

router.put("/:id",(req,res)=>{
    Tasks.findByIdAndUpdate(req.params.id, req.body)
    .then(()=>res.json({msg:"Update successfully"}))
    .catch(()=>res.status(400).json({msg:"Update failed"}));
});

router.delete("/:id",(req,res)=>{
    Tasks.findByIdAndDelete(req.params.id)
    .then(()=>res.json({msg:"Deleted Successfully"}))
    .catch(()=>res.status(400).json({msg:"Cannot be Delete"}))
});
module.exports = router;