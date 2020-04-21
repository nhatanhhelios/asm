const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var indexController = require("./index.js");
var productController = require("./product.js");
var userController = require("./user.js");
var loginController = require("./login.js");
var manageController = require("./manage.js");

app.use('/', indexController);
app.use('/product', productController);
app.use('/user', userController);
app.use('/login', loginController);
app.use('/manage', manageController);

app.listen(process.env.PORT || 5000);