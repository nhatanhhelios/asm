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

//
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
var upload = multer({ storage: storage })

///////////////////////////////////////
router.get('/photos', async(req, res) => {
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    dbo.collection('Product').find().toArray((err, result) => {
  
      const imgArray = result.map(element => element._id);
      console.log(imgArray);
      if (err) return console.log(err)
      res.send(imgArray)
    })
});

router.get('/photo/:id', async(req, res) => {
    var filename = req.params.id;
  
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    dbo.collection('Product').findOne({'_id': ObjectId(filename) }, (err, result) => {
      if (err) return console.log(err)
      res.contentType('image/jpeg');
      res.send(result.Image.image.buffer);
    })
})


router.get('/', async(req,res)=>
{
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let results = await dbo.collection("Product").find({}).toArray();
    let count = await dbo.collection("Product").countDocuments();
    res.render('allProduct',{product:results, count:count});
})

//search
router.get('/search', (req,res)=> {
  res.render('allProduct')
})

router.post('/search', async(req,res)=> {
  let searchPrd = req.body.name;
  let client= await MongoClient.connect(url);
  let dbo = client.db("asmDB");
  let results = await dbo.collection("Product").find({"Name": searchPrd}).toArray();
  res.render('allProduct',{product:results});
})

//add

router.get('/add', async(req,res)=>
{
    res.render('addProduct');
})

router.post('/add', upload.single('picture'), async(req,res)=>
{
    let name = req.body.name;
    let price = req.body.price;
    let category = req.body.category;
    let description = req.body.description;

    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };

    let newProduct= {Name: name, Price: price, Category: category, Image:finalImg, Description:description};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    dbo.collection("Product").insertOne(newProduct);

    res.redirect('/product');
})

// Update product
router.get('/update', async(req,res)=>
{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('updateProduct',{product:result});
})

router.post('/update', upload.single('picture'), async(req,res)=>
{

    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let category = req.body.category;
    let description = req.body.description;

    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var filename = req.params.id;
    
    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };

    var ObjectID = require('mongodb').ObjectID;
    let condition = {_id: ObjectID(id)};
    let newProduct= {$set:{Name: name, Price: price, Category: category, Image:finalImg, Description:description}};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmDB");
    await dbo.collection("Product").updateOne(condition,newProduct);
    res.redirect('/product');
})

//Delete
router.get('/delete', async(req,res)=>{
  let id = req.query.id;
  var ObjectID = require('mongodb').ObjectID;

  let client= await MongoClient.connect(url);
  let dbo = client.db("asmDB");
  let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
  res.render('deleteProduct',{product:result});

})

router.post('/delete', async(req,res)=>{
  let id = req.body.id;
  var ObjectID = require('mongodb').ObjectID;
  let condition = {"_id" : ObjectID(id)};
  
  let client= await MongoClient.connect(url);
  let dbo = client.db("asmDB");
  await dbo.collection("Product").deleteOne(condition);

  res.redirect('/product');
})

module.exports = router;