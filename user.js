const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb+srv://helios:sat123123@cluster0-jrr4i.azure.mongodb.net/test?retryWrites=true&w=majority';

router.get('/', async(req,res) => {
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("User").find({}).toArray();
    res.render('allUser',{user:results});
})

//search
router.get('/search', (req,res)=> {
    res.render('allUser')
})
  
router.post('/search', async(req,res)=> {
    let searchUser = req.body.username;
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("User").find({"Name": searchUser}).toArray();
    res.render('allUser',{user:results});
})

// Add
router.get("/add", (req,res)=> {
    res.render('addUser');
})

router.post('/add', async(req,res)=> {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let email = req.body.email;
    let phone = req.body.phone;
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    dbo.collection("User").insertOne({"Username": username,"Password": password,"Name": name,"Age": age,"Gender": gender,"Email": email,"Phone": phone}, (req, res)=>{
        if (req) throw req;
        console.log("1 document inserted");
        client.close();
    })
    res.redirect('/user');
})

//Update
router.get('/update', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let result = await dbo.collection("User").findOne({"_id" : ObjectID(id)});
    res.render('updateUser',{user:result});

})

router.post('/update', async(req,res)=>{
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let email = req.body.email;
    let phone = req.body.phone;
    let newValues ={$set : {Username: username,Password: password,Name: name,Age: age,Gender: gender,Email: email,Phone: phone}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    await dbo.collection("User").updateOne(condition,newValues);

    res.redirect('/user');
})

//Delete
router.get('/delete', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let result = await dbo.collection("User").findOne({"_id" : ObjectID(id)});
    res.render('deleteUser',{user:result});

})

router.post('/delete', async(req,res)=>{
    let id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    await dbo.collection("User").deleteOne(condition);

    res.redirect('/user');
})

module.exports = router;