const express = require('express');
const app = express();
const taskRoute = require('./routes/tasks');    // ルーティングファイル読み込み
const connectDB = require('./db/connect');      // dbファイル読み込み
const PORT = parseInt(process.env.PORT)||3000;  // PORT指定
const cors = require('cors');

require("dotenv").config(); //  .envファイルから環境変数設定

// クロスオリジン設定
app.use(cors());            
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PATCH','DELETE'],
    allowedHeaders:['Content-Type'],
}))


//静的ファイルルーティング設計
app.use(express.json());
app.use(express.static("./public"));


//  ルーティング設計
app.use("/api/v1/tasks", taskRoute);    


// データベーススタートアップ
const start = async () => {
    try {
        //  データベースと接続(todoapp)
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log("データベースと接続しました");
            console.log(`http://localhost:${PORT}/api/v1/tasks`);
        })
    }
    catch (err) {console.log(err)}
}
  
start();