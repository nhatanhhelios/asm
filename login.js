const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb+srv://helios:sat123123@cluster0-jrr4i.azure.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',(req,res)=>{
    res.render('login');
})

router.post('/ok', async(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("User").find({"Username":username, "Password":password}).toArray();
        if(results != 0)
        {
            res.redirect("/manage");          
        }
        else
        {
            res.redirect("/login");    
        }
})

module.exports = router;