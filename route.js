var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
router.use(bodyParser.raw());

var acc = require('./module');

const mongoose = require('mongoose');
const account = require('./module');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url ='mongodb://localhost:27017/Accounts' ;
db.acc =  acc; 

db.mongoose.connect(db.url,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("connected to the database!");
})
.catch(err =>{
    console.log("cannot connect to the database",err);
});

acc = db.acc;


//for New account datails addition
router.post("/insertAccount",async(request,response) =>{
    const user = new account(request.body);
    try{
        await user.save();
        response.send(user);
    }catch(error){
        response.status(500).send(error);
    }
});

//to fetch the all the data we have added.
router.get("/getAllAccounts",async(req,res)=>{
    try{
        var response = await acc.find().select({accountNo:1,AccholderName:1,AccountBal:1});
        let output = {"msg":true,"data":response}
        res.json(output);
    }
    catch{
        console.log("msg",false);
    }
});

//for updation
router.put("/updateAcc/:AccholderName",async(req,res)=>{
    try{
        var name=req.params.AccholderName;
        var accNo=req.body.accNo;
        var NewBal= req.body.NewBal;
        let response=await acc.findOneAndUpdate({"AccholderName":name},{"AccountBal":NewBal});
        res.json(response);
    }
    catch{
        console.log("update failed");
    }
} );


//for deposite
router.put("/Deposite/:accountNo", async (req,res)=>{
    try{
        var accNo = req.params.accountNo;
        var newAmt= req.body.amt;
        let u1 = await acc.find({"accountNo":accNo}).select({AccountBal:1})
        let oldAmt = u1[0].AccountBal;
        let response=await acc.findOneAndUpdate({"accountNo":accNo},{'AccountBal':(oldAmt+newAmt)});
        res.json(response);
    }
    catch{
        console.log("err");
    }
});

//for withdraw
router.put("/Withdraw/:accountNo", async (req,res)=>{
    try{
        var accNo = req.params.accountNo;
        var newAmt= req.body.amt;
        let u1 = await acc.find({"accountNo":accNo}).select({AccountBal:1})
        let oldAmt = u1[0].AccountBal;
        let response=await acc.findOneAndUpdate({"accountNo":accNo},{'AccountBal':(oldAmt-newAmt)});
        res.json(response);
    }
    catch{
        console.log("err");
    }
});


//for delete
router.delete("/deleteAcc/:accNo",async(req,res)=>{
    try{
        var name=req.params.name;
        var id = req.params.id;
        var accNo=req.params.accNo;
        var result=await account.findOneAndDelete({" accountNo":accNo});
        res.json(result);
    }
    catch{
        console.log("not deleted.");
    }
})

//for searching specific data
router.get("/searchAcc/:AccholderName",async (req,res)=>{
    try{
        var name=req.params.AccholderName;
        var result=await account.find({"AccholderName":name}).select({"_id":0});
        res.json(result);
    }
    catch{
        console.log("record not found!");
    }
})

//pagination
router.get("/pagination/:limit/:skip",async (req,res)=>{
    try{
        var lim= req.params.limit;
        var ski=req.params.skip;
        var result=await account.find().select({_id:0}).skip(ski).limit(lim)
        res.json(result);
    }
    catch{
        console.log("record not found!");
    }
})


module.exports = router;
