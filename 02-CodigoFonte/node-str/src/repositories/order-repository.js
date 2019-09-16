'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');


exports.create = async (data) => {
    var order = new Order(data);
    return await order.save();
}

exports.get = async () => {
    var resp = await Order.find({}, 'number status customer items')
    .populate('customer', 'name')
    .populate('items.product', 'title')
    ;
    return resp;
}