'use strict';

const ValidationContract = require('../validators/validation');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');


exports.post = async (req, res, next) => {

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O name deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'Email invalido');
    contract.hasMinLen(req.body.password, 6, 'A password deve conter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.erros()).end();
        return;
    }

    try {
        var data = await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });
        res.status(200).send({
            message: 'Cliente cadastrado com sucesso', data
        });
    }
    catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};


exports.authenticate = async (req, res, next) => {

    try {
        var customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
       
        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    }
    catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
};

exports.refreshtoken = async (req, res, next) => {

    try {
        const token = req.body.token || req.query.token|| req.headers['x-access-token'];
        const data = await authService.decodeToken(token);


        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(401).send({
                message: 'cliente nao encontrado'
            });
            return;
        }

        const tokenDate = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    }
    catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};
