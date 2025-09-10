const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../app');

describe('Pix Controller Tests', () =>{
    describe('Testes para registro, login, consulta de saldo, extrato e transações PIX.', () =>{
      it('Quando registro um usuário válido o retorno será 201', async () =>{
        const resposta = await request(app)
                .post('/users/register')
                .send({
                    username: "jbessa",
                    password: "12345",
                    pixKey: "01257845912"
                });
                
                expect(resposta.status).to.equal(201);
                expect(resposta.body).to.have.property('message', 'User registered successfully.');
      });
      
      it('Quando informo usuário inexistente ou não encontrado o retorno será 404', async () =>{
        const resposta = await request(app)
                .post('/pix/pay')
                .send({
                    username: "julio de lima",
                    amount: 10,
                    pixKey: "12345678973"
                });
                
                expect(resposta.status).to.equal(404);
                expect(resposta.body).to.have.property('message', 'User not found.');
      });

      it('Quando não informo os campos obrigatórios para registro de usuário o retorno será 400', async () =>{
        const resposta = await request(app)
            .post('/users/register')
            .send({
                    username: "jbessa",
                    password: 123,
                  });
                
                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('message', 'Username, password and PIX key are required.');
      });

      it('Quando tento registrar usuário duplicado o retorno será 409', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "jbessa", 
                    password: "123", 
                    pixKey: "12345678973" 
                  });

        const resposta = await request(app)
            .post('/users/register')
            .send({ 
                    username: "jbessa", 
                    password: "123", 
                    pixKey: "98765432100" 
                 });

                expect(resposta.status).to.equal(409);
                expect(resposta.body).to.have.property('message', 'User already exists.');
      });

      it('Quando tento registrar chave PIX duplicada o retorno será 409', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "user1", 
                    password: "123", 
                    pixKey: "12345678973" 
                 });

        const resposta = await request(app)
            .post('/users/register')
            .send({ 
                    username: "user2", 
                    password: "123", 
                    pixKey: "12345678973" 
                 });
        
                expect(resposta.status).to.equal(409);
                expect(resposta.body).to.have.property('message', 'PIX key already exists.');
      });

      it('Quando tento logar com credenciais inválidas o retorno será 401', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "user3", 
                    password: "123", 
                    pixKey: "11111111111"
                 });
        const resposta = await request(app)
            .post('/users/login')
            .send({ 
                    username: "user3", 
                    password: "wrong password" 
                 });

               expect(resposta.status).to.equal(401);
               expect(resposta.body).to.have.property('message', 'Invalid credentials.');
      });

      it('Quando tento logar com credenciais inválidas o retorno será 401', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "user3", 
                    password: "123", 
                    pixKey: "11111111111" 
                 });
        const resposta = await request(app)
            .post('/users/login')
            .send({ username: "user3", password: "wrong password" });

               expect(resposta.status).to.equal(401);
               expect(resposta.body).to.have.property('message', 'Invalid credentials.');
      });

      it('Quando tento registrar chave PIX de forma duplicada o retorno será 409', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "user1", 
                    password: "123", 
                    pixKey: "12345678973"
                 });
        const resposta = await request(app)
            .post('/users/register')
            .send({ 
                    username: "user2", 
                    password: "123", 
                    pixKey: "12345678973"
                 });

               expect(resposta.status).to.equal(409);
               expect(resposta.body).to.have.property('message', 'PIX key already exists.');
      });

      it('Quando tento receber PIX com chave inválida o retorno será 400', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "recebedor2", 
                    password: "123", 
                    pixKey: "77777777777"
                 });
        const resposta = await request(app)
            .post('/pix/receive')
            .send({ 
                    username: "recebedor2", 
                    amount: 10, 
                    pixKey: "88888888888"
                 });

               expect(resposta.status).to.equal(400);
               expect(resposta.body).to.have.property('message', 'PIX key does not match user.');
      });

      it('Quando tento pagar com saldo insuficiente o retorno será 400', async () => {
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "pagador", 
                    password: "123", 
                    pixKey: "22222222222"
                 });
        await request(app)
            .post('/users/register')
            .send({ 
                    username: "recebedor", 
                    password: "321", 
                    pixKey: "33333333333"
                 });
        const resposta = await request(app)
            .post('/pix/pay')
            .send({ 
                    username: "pagador", 
                    amount: 1000, 
                    pixKey: "33333333333"
                 });

               expect(resposta.status).to.equal(400);
               expect(resposta.body).to.have.property('message', 'Insufficient balance.');
      });
    });
});