'use strict';
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async () => {
    return await Order
        .find({}, 'number status customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
};

exports.create = async (data) => {
    const order = new Order(data);
    await order.save();
};

exports.delete = async (id) => {
    await Order.findByIdAndDelete(id);
};

exports.update = async (id, data) => {
    await Order
        .findByIdAndUpdate(id, {
            $set: {
                status: data.status,
                customer: data.customer,
                items: data.items
            }
        });
}