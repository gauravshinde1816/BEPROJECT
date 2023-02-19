const web3 = require("web3")
const express  = require("express")
const Tx = require("ethereumjs-tx")
const router = express.Router()



// web3 intialize
//Infura HttpProvider Endpoint
const web3js = new web3(new web3.providers.HttpProvider(""));

router.get("/send/tx" , async(req , res)=>{
    try {
        
    } catch (error) {
        console.log(error.message)
    }
})



