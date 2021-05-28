'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_validator_1 = require('express-validator');
const Auth_1 = require('../models/Auth');
const AuthDAO_1 = require('../models/DAO/AuthDAO');
const ApiResponse_1 = require('../models/ApiResponse');
const register = (app) => {
	app.post(
		'/register',
		express_validator_1.header('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		express_validator_1
			.header('email')
			.exists()
			.withMessage('Parâmetro email é obrigatório.')
			.isEmail()
			.withMessage('Email inválido.'),
		(req, res) => {
			const validationErrors = express_validator_1.validationResult(req).array();
			const apiResponse = new ApiResponse_1.ApiResponse();
			if (!req.headers.agency) {
				validationErrors.push({
					param: 'email',
					value: req.header.agency,
					location: 'headers',
					msg: 'Parâmetro agency é obrigatório.',
				});
			}
			if (validationErrors.length > 0) {
				const message = validationErrors.map((err) => err.msg).join(' ');
				apiResponse.responseText = message;
				apiResponse.statusCode = 400;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}
			const newUserAuth = new Auth_1.Auth(
				req.headers.permission,
				req.company,
				req.headers.permission === 'user' ? req.headers.agency : '',
				req.headers.email
			);
			const token = req.headers.token;
			const authDAO = new AuthDAO_1.AuthDAO(token);
			authDAO
				.addAuth(newUserAuth)
				.then((token) => {
					const message = `Permissão adicionada para o email ${newUserAuth.email}, senha: ${token}`;
					apiResponse.responseText = message;
					apiResponse.statusCode = 200;
				})
				.catch((err) => {
					const message = 'Falha ao criar permissão!';
					apiResponse.responseText = message;
					apiResponse.errorMessage = err.message;
					apiResponse.statusCode = 500;
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		}
	);
};
exports.default = register;
