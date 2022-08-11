var express = require('express');
var app = express();
var cors = require('cors');
var router = require("./router");
const session = require('express-session')

//session
app.use(session({
    secret: 'secretkey',
    rolling: true,
    saveUninitialized: false,
    resave: true, 
    cookie: { maxAge: 15 * 60 * 1000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin : "http://140.116.214.154:8080",
    credentials: true,
}));

app.use('/api', router.router)

app.listen(3000, "0.0.0.0", function () {
    console.log('app listening on port 3000!');
});