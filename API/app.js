const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const request = require('request');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser")

const cors = require('cors');
const dotenv = require ("dotenv");

dotenv.config()


//ROUTES
const imagesRoute = require('./routes/images');
const newsRoute = require('./routes/news');
const portfoliosRoute = require('./routes/portfolios');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/order');
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const mpRoute = require('./routes/mercadoPago')

const app = express();

app.use(cors({
    origin:"*",
    method:['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders:'Content-type, Authorization, Origin, X-Requested-With, Accept'
}));

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

//USE ROUTES
app.use('/presets', productsRoute);
app.use('/images', imagesRoute);
app.use('/portfolios', portfoliosRoute);
app.use('/orders', ordersRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/news', newsRoute);
app.use('/mp', mpRoute)

module.exports = app;