'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const bcrypt = require('bcryptjs');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            roles: ["user"]
        });

        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.put = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await repository.update(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        res.status(200).send({ message: 'Cliente atualizado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(200).send({ message: 'Cliente removido com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.getByEmail(req.body.email);
        if (!customer) {
            res.status(404).send({ message: 'Usuário ou senha inválidos' });
            return;
        }

        const isMatch = await bcrypt.compare(req.body.password, customer.password);
        if (!isMatch) {
            res.status(404).send({ message: 'Usuário ou senha inválidos' });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};
