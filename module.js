const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
    accountNo:{
        type : Number,
        default : 0
    },
    AccholderName:{
        type : String
    },
    AccountBal :{
        type : Number
    }
});

const account = mongoose.model("AccData",accountSchema,"account");
module.exports = account;