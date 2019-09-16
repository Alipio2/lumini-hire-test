'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {

    const resp = await Product.find({
        active: true
    }, 'title price slug');

    return resp;

}

exports.getById = async (id) => {
    return await Product.findById(id);
}

exports.getByTag = async (tag) => {
    return await Product.find({
        tags: tag,
        active: true
    },
        'title price slug');
}

exports.create = async (data) => {
    var product = new Product(data);
    return await product.save();
}

exports.update = async (id, data) => {
    return await Product.findByIdAndUpdate(
        id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price
            }
        });
}

exports.delete = async (id) => {
    return await Product.findOneAndRemove(id);
}