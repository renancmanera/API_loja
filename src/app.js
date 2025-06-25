'use strict';

const express = require('express'); // importar express
const bodyParser = require('body-parser'); // importar body-parser para converter para json no postman
const mongoose = require('mongoose'); // importar mongoose para conectar ao banco de dados MongoDB
const config = require('./config'); // importar configuração do banco de dados

const app = express(); // importar express e criar aplicação
const router = express.Router(); // criar roteador

//  CONEXÃO COM O BANCO DE DADOS
mongoose.connect(config.connectionString);

// CARREGA OS MODELS
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

// CARREGA AS ROTAS
const indexRoute = require('./routes/index-route'); // carrega rotas
const productRoute = require('./routes/product-route'); // carrega rotas
const customerRoute = require('./routes/customer-route'); // carrega rotas
const orderRoute = require('./routes/order-route'); // carrega rotas

app.use(bodyParser.json()); // usar body-parser para converter o corpo da requisição em json
app.use(bodyParser.urlencoded({ extended: false })); // usar body-parser para converter o corpo da requisição em urlencoded

app.use('/', indexRoute); // usar o roteador
app.use('/products', productRoute); // usar o roteador
app.use('/customers', customerRoute); // usar o roteador
app.use('/orders', orderRoute); // usar o roteador

module.exports = app; // exportar a aplicação