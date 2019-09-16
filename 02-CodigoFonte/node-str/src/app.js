'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');


mongoose.connect(config.connectingString);

//model
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/order');

//rotas
const index = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

app.use(bodyParser.json({
    limit: '4mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/', index);
app.use('/produts', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);

module.exports = app;