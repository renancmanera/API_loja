'use strict';

const repository = require('../repositories/order-repository'); // importar o repositório
const guid = require('guid'); // importar o gerador de UUID
const authService = require('../services/auth-service'); // importar o serviço de autenticação

exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async(req, res, next) => {
    try {
        // recupera o toker
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        // decodifica o token
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({
            message: 'Pedido cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Pedido removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, {
            status: req.body.status,
            customer: req.body.customer,
            items: req.body.items
        });
        res.status(200).send({
            message: 'Pedido atualizado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}
