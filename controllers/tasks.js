const Task = require('../models/Task');
//データ取得
const mongoose = require('../db/connect');

//　すべてのタスクを取得
const getAlltasks = async (req,res)=>{
    try{
        const allTask  = await Task.find({});
        res.status(200).json(allTask)
    }
    catch(err){
        res.status(500).json(err)
    }
};

//  タスク作成
const createTask = async(req,res)=>{   
    try{
        const createTask  = await Task.create(req.body);
        res.status(200).json(createTask)
    }
    catch(err){
        res.status(500).json(err)
    }
};

//  特定の名前のタスクを取得
const getSingleTask =async(req,res)=>{
    try{
        const getSingleTask  = await Task.findOne({_id:req.params.id});
        //  リクエスト結果がnullの場合(タスクが存在しない場合)
        if(!getSingleTask){
            return res.status(404).json(`_id:${req.params.id}というタスクは存在しません`);
        }
        res.status(200).json(getSingleTask)
    }
    catch(err){
        res.status(500).json(err)
    }
};

const updateTask =async(req,res)=>{
    try{
        const updateTask  = await Task.findOneAndUpdate({_id:req.params.id},req.body,{new:true});
        //  リクエスト結果がnullの場合(タスクが存在しない場合)
        if(!updateTask){
            return res.status(404).json(`_id:${req.params.id}というタスクは存在しません`);
        }
        res.status(200).json(updateTask)
    }
    catch(err){
        res.status(500).json(err)
    }
};

const deleteTask =async (req,res)=>{
    try{
        const deleteTask  = await Task.deleteOne({_id:req.params.id});
        //  リクエスト結果がnullの場合(タスクが存在しない場合)
        if(!deleteTask){
            return res.status(404).json(`_id:${req.params.id}というタスクは存在しません`);
        }
        res.status(200).json(deleteTask)
    }
    catch(err){
        res.status(500).json(err)
    }
};

module.exports={
    getAlltasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask,
};

