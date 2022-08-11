const con = require('../Model/connectMySQL')
var Today = new Date();
const fs = require('fs');

exports.lineMemo_upload = function(req, res){
    const stockName = req.body.stock_num_name.slice(4)
    const stockNum = req.body.stock_num_name.slice(0, 4)
    const date = req.body.date
    const inputTime = String(Today.getHours()).padStart(2, '0') + ":" + String(Today.getMinutes()).padStart(2, '0') + ":" + String(Today.getSeconds()).padStart(2, '0')
    const filename = stockNum + "_" + stockName + "_" + date + "_" + inputTime + ".txt"
    const username = req.session.userName
    const content = req.body.content

    fs.writeFileSync("/home/cosbi/桌面/financialData/lineMemo_data/" + filename, content);

    con.query("INSERT INTO `lineMemo` (`stockNum`, `stockName`, `date`, `filename`, `inputTime`, `username`) VALUES (?, ?, ?, ?, ?, ?)", [stockNum, stockName, date, filename, inputTime, username], function(err, result, field){
        if(err === null){
            res.status(200).send("success");
        }else{
            res.status(400).send("error");
        }
    });
};