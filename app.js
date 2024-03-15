var express = require('express');
var app = express();

var router = require('./route');
app.use("/api",router);

app.listen(3001,function(){
    console.log("sever listining on port 3001");
})