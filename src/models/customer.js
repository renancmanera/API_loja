// modelo banco de dados do produto

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const schema = new Schema({
    name: { // id criado automaticamente pelo MongoDB
        type: String,
        required: true,
        trim: true,
    },
    email: { // product-1
        type: String,
        required: [true, 'O email é obrigatório'],
        trim: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Customer', schema);