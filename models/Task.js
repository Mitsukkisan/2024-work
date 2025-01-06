//  データベーススキーマ,モデル作成
const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    //  タスク名
    name:{
        type:String,
        required:[true,"タスク名を入れてください"],
        trim: true,
        maxlength: [20,"タスク名は20文字以内で入力してください"],
    },
    //  期限
    deadline:{
        type:Date,
        required: [true,"期限を設定してください"] ,
    } ,
});


//  モデル名指定後エクスポート
module.exports = mongoose.model("Task",TaskSchema)