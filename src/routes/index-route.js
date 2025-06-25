'use strict';

const express = require('express'); // importar express
const router = express.Router(); // criar roteador

// configurar rotas
router.get('/', (req, res, next) => {
    res.status(200).send({ // status code 200 OK
        title: "Node Store API",
        version: "0.0.1",
    });
});

module.exports = router; // exportar o roteador