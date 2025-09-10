const request = require('supertest');
const { expect } = require('chai');

const app = require('../../app');
const envs = require('../../envs');

describe('Pix Controller Tests', () =>{
    describe('Testes para registro, login, consulta de saldo, extrato e transações PIX.', () =>{
      it('Quando registro um usuário válido o retorno será 201', async () =>{
  const resposta = await request(envs.BASE_URL_REST)
                .post('/users/register')
                .send({
                    username: "jbessa",
                    password: "12345",
                    pixKey: "01257845912"
                });
                
                expect(resposta.status).to.equal(201);
                expect(resposta.body).to.have.property('message', 'User registered successfully.');
      });
    
    });
});