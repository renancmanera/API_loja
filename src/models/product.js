// modelo banco de dados do produto

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const schema = new Schema({
    title: { // id criado automaticamente pelo MongoDB
        type: String,
        required: true,
        trim: true
    },
    slug: { // product-1
        type: String,
        required: [true, 'O slug é obrigatório'],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{ // array de string
        type: String,
        required: true
    }],
    image: {
        type: String,
        required: false, // opcional
        trim: true
    }
});

module.exports = mongoose.model('Product', schema);