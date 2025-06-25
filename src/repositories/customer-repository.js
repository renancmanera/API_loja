'use strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async () => {
    return await Customer
        .find({}, 'name email') // Seleciona apenas os campos 'name' e 'email'
        .sort('name'); // Ordena pelo campo 'name'
};

exports.create = async(data) => {
    var customer = new Customer(data);
    await customer.save();
}

exports.delete = async (id) => {
    await Customer.findByIdAndDelete(id);
};

exports.update = async (id, data) => {
    await Customer
        .findByIdAndUpdate(id, {
            $set: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        });
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({ 
        email: data.email, password: data.password 
    });
    return res;
}