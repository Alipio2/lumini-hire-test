'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');


exports.create = async (data) => {
    var customer = new Customer(data);
    return await customer.save();
}

exports.authenticate = async(data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

exports.getById = async (id) => {

    const resp = await Customer.findById(id);

    return resp;
}
