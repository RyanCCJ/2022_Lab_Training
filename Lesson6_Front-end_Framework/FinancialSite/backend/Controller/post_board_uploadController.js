var multer  = require('multer')
var Today = new Date();
const con = require('../Model/connectMySQL')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '/home/cosbi/桌面/financialData/post_board_data')
    },
    filename: (req, file, callBack) => {
        callBack(null, Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0') + "_" + file.originalname)
    }
})

var multer_object = multer({ storage: storage })

exports.post_board_middleWare = function(req, res, next){
    const upload = multer_object.fields([{ name : 'selectFile' }])
    upload(req, res, function(err){
        if(err){
            console.log(`multer errors:${err}`)
            return res.status(400).send("multer error")
        }
        next()
    })
}

exports.post_board_upload = function(req, res){
    let filename = "NULL"
    const date = req.body.date
    const username = req.session.userName
    const stockName = req.body.stock_num_name.slice(4)
    const stockNum = req.body.stock_num_name.slice(0, 4)
    const evaluation = req.body.evaluation
    const price = req.body.price
    const reason = req.body.reason
    if(req.body.filename !== "") filename = date + "-" + req.body.filename
    

    con.query("INSERT INTO `post_board_memo` (`date`, `username`, `stockName`, `stockNum`, `evaluation`, `price`, `reason`, `filename`, `supplement`) VALUES (?, ?, ?, ?, ?, ? ,? ,?, ?)", [ date, username, stockName, stockNum, evaluation, price, reason, filename, "NULL" ], function(err, result, field){
        if(err === null){
            res.status(200).send("success");
        }else{
            res.status(400).send("error");
        }
    });
};