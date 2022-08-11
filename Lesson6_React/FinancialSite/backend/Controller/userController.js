const bcrypt = require('bcrypt');
const con = require('../Model/connectMySQL')

exports.login = async function(req, res){
    var userName = req.body.userName
    var password = req.body.password

    con.query("SELECT `password` FROM `user` WHERE `userName` = ?", [userName], function(err, result, field){
        if(err === null){
            if(bcrypt.compareSync(password, result[0].password)){
                req.session.userName = userName;

                res.status(200).send("success");
            }else{
                res.status(400).send("Username or password error");
            }
        }else{
            res.status(400).send("Username or password error");
        }
    });
}

exports.logout = async function(req, res){
    try {
        req.session.destroy();
        res.status(200).send("success");
    } catch (error) {
        res.status(400).send("error");
    }
}

exports.register = async function(req, res){
    var name = req.body.name
    var userName = req.body.userName
    var email = req.body.email
    const hash_password = bcrypt.hashSync(req.body.password, 10);

    con.query("INSERT INTO `user` (`name`, `userName`, `password`, `superUser`, `email`) VALUES (?, ?, ?, ?, ?)", [ name, userName, hash_password, 0, email ], function(err, result, field){
        if(err === null){
            res.status(200).send("success");
        }else{
            res.status(400).send("error");
        }
    });
}