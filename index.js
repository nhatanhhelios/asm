const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
app.use(bodyParser.urlencoded({ extended: true }))
var router = express.Router();

const MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectId

var url = 'mongodb+srv://helios:sat123123@cluster0-jrr4i.azure.mongodb.net/test?retryWrites=true&w=majority';

router.get('/', async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('index', {product:results});
})

router.get('/lego', async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("Product").find({Category:"Lego"}).toArray();
    res.render('index', {product:results});
})

router.get('/boardgame', async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("Product").find({Category:"Board game"}).toArray();
    res.render('index', {product:results});
})

router.get('/prddetail', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('prdDetail',{product:result});
})

module.exports = router;