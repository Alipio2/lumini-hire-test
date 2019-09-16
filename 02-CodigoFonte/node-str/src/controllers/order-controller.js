'use strict';

const ValidationContract = require('../validators/validation');
const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');


exports.post = async (req, res, next) => {
    
    let contract = new ValidationContract();
    contract.isRequired(req.body.customer, 'O Usuario é necessarios');  

    if (!contract.isValid()) {
        res.status(400).send(contract.erros()).end();
        return;
    }

    try {
        //recupera o token
        const token = req.body.token || req.query.token|| req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

         await repository.create(
            {
                customer: data.id,
                number: guid.raw().substring(0, 6),
                createDate: Date.now,
                items: req.body.items,
                status: "created"
            });
        res.status(200).send({
            message: 'Ordem cadastrada com sucesso'
        });
    }
    catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    }
    catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};
